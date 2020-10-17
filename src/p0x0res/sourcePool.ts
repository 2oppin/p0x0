import {CARDINALS, Entity} from "p0x0/entity";
import {p0x0source} from "p0x0res/source";
import {Utils} from "utils/utils";

enum LoadableType {ENTITY = "entity", IMPLEMENTATION = "ID", RESOURCE = "RES"}

export class SourcePool {
    constructor(protected sources: p0x0source[]) {}

    public async loadInstance(entity: string | Partial<Entity>, data: any): Promise<any> {
        const instName: string = typeof entity === "string" ? entity : entity.name;
        const instanceEntity: Entity = Utils.merge(
            await (this.load(LoadableType.ENTITY, instName) as Promise<Entity>),
            typeof entity === "string" ? {} : entity,
        );
        return (data.ID
                ? this.load(LoadableType.IMPLEMENTATION, instName, data.ID)
                : Promise.resolve(data)
        )
            .then(async (reqImp: any) => ({
                ...(await this.loadObject(reqImp, instanceEntity)),
                ...data,
            }));
    }

    public loadEntity(entName: string): Promise<Entity> {
        return this.load(LoadableType.ENTITY, entName) as Promise<Entity>;
    }

    protected load(
        type: LoadableType,
        p0x0Name,
        ID: string = null,
        sources: p0x0source[] | null = null,
    ): Promise<Entity|string> {
        if (type === LoadableType.ENTITY && CARDINALS.includes(p0x0Name)) {
            return Promise.resolve(p0x0Name);
        }
        const _srcStack = (sources || this.sources).slice(0);
        return new Promise((resolve, reject) => {
            const search = () => {
                if (!_srcStack.length) {
                    return Promise.reject(
                        `${p0x0Name} not found in sources: ${(sources || this.sources).map((s) => s.type).join()}`,
                    );
                }

                const srcT = _srcStack.pop();
                const typeMap: {[key in keyof typeof LoadableType]: () => Promise<Entity|string>} = {} as any;
                typeMap[LoadableType.ENTITY] =
                    () => srcT.load(p0x0Name, false)
                        .then((data) => new Entity(data));
                typeMap[LoadableType.IMPLEMENTATION] = () => srcT.loadImplementation(p0x0Name, ID);
                typeMap[LoadableType.RESOURCE] = () =>
                    srcT.loadResource(p0x0Name)
                        .then((buff: Buffer) => buff.toString());
                return typeMap[type]()
                    .catch((err) => _srcStack.length
                        ? search()
                        : Promise.reject(err),
                    );
            };
            return search()
                .then(resolve)
                .catch((err) => reject(err));
        });
    }

    protected async loadObject(obj: any, entity: Entity): Promise<any> {
        for (const prop in obj) {
            if (typeof obj[prop] === "object") {
                if (!entity.fields[prop]) {
                    throw new Error(`Unknown property "${prop}" in ${entity.name}`);
                }
                const [type, isArray, isMap, isFunction] = Entity.getTypeFromString(entity.fields[prop] as string);
                const propEnt: Entity =
                    (await this.load(LoadableType.ENTITY, type)) as Entity;
                const getPropValFnc = async (val: any) => {
                    if (val.RES)  return await this.load(LoadableType.RESOURCE, val.RES);

                    if (val.ID) {
                        val = await this.load(LoadableType.IMPLEMENTATION, propEnt.name, val.ID)
                            .then((imp: any) => ({...imp, ...val}));
                    }
                    return await this.loadObject(val, propEnt);
                };
                if (isMap) {
                    for (const key in obj[prop]) {
                        if (obj[prop].hasOwnProperty(key)) {
                            obj[prop][key] = await getPropValFnc(obj[prop][key]);
                        }
                    }
                } else if (isArray) {
                    obj[prop] = await Promise.all(obj[prop].map((v) => getPropValFnc(v)));
                } else {
                    obj[prop] = obj[prop] && await getPropValFnc(obj[prop]);
                }
            }
        }
        return obj;
    }
}
