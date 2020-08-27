# p0x0

p0x0 is a tool that has an objective to increase development speed by reducing time/efforts spent to comeup with namings and then to write pretty generic code of basic entities aka POJO (Plain Old Java Object).\
That's where from it's name p0x0 where "x" stands for the language of your choice. 

For now that's only TS, and SQLite representation just for illustrating basic concept. 

An author has hit time to time an issue, when basic were need to be constructed for the POC or even MVP stages and attempts to take an example from the previous solution encounters an obstacle, that suddenly User entity has an "login" field instead of "name" or "emailAddress" instead of "email" etc.\
And suddenly attempt to reuse ACL system failed, because the code under the hood relies on a certain property name that really hard to change right away across all the code.\
So usually such issues are resolved by writing adapters to convert one User type to the another, threaten to remain for an ages in the system, or re-reading an old code, and then write the same component from the scratch keeping in mind an old idea.\
And such cases eats the time.

So as a solution there may be providing some kind of a standard for a naming, and maybe have some repository of simple entities, to keep all those primitive and generic Plain Old X Objects in one special-folder stable.\
One of such repositories was thought schema.org, that had an xml(rdf) representations of an entities like Author, Book etc,.. but now they are not...

The project compiles in to a cli (a bit bloated ~ 5Mb, because of clumsy RDF support, but it's temporarily)

To have your entities generated you'll need to have a p0x0.json file (or pass another-named/located file as an param) that have contents similar to the following: 
# Example
```
{
  "output": ".p0x0",
  "prototypes": [
    "Thing",
    "JsonThing",
    "CoolJsonThing"
  ],
  "sources": [
    {
      "type": "rdf",
      "dir": "./tests/entities"
    },
    {
      "type": "json",
      "url": "http://localhost:8888"
    }
  ],
  "generators": [
    "ts",
    "sqlite"
  ]
}
```
Now let's traverse the params:

## output
Is a folder where the entities will be generated

## prototypes
Is a set of filenames(without an extension) of the described entities
- ### rdf
is an rdf that may be grabbed from the schema.org examples

 - ### json
```
{
  "name": "CoolJsonThing",
  "base": "JsonThing",
  "fields": {
    "coolName": "String",
    "link": "CoolJsonThing"
  }
}
```
where **name** is a output entity filename (and class name if supported by language or table/collection name, etc)
**base** - base class(entity) name
**fields** - set of entity properties

## sources
for now there are 2 optoins: 
 - files loaded from an passed as a param directory,
 - remote. Assumes that remote url supports GET <url>/<Entity-Name> requests and returns valid format described above rdf/json (json in this case expected)

## generators
The list of required output, in this particular case TS class and SQLite create table command will be generated
