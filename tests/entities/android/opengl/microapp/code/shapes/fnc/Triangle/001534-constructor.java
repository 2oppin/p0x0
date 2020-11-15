// initialize vertex byte buffer for shape coordinates
ByteBuffer bb = ByteBuffer.allocateDirect(
        // (number of coordinate values * 4 bytes per float)
        triangleCoords.length * 4);
// use the device hardware's native byte order
bb.order(ByteOrder.nativeOrder());

// create a floating point buffer from the ByteBuffer
vertexBuffer = bb.asFloatBuffer();
// add the coordinates to the FloatBuffer
vertexBuffer.put(triangleCoords);
// set the buffer to read the first coordinate
vertexBuffer.position(0);

int vertexShader = MicroappRenderer.loadShader(GLES20.GL_VERTEX_SHADER,
                                vertexShaderCode);
int fragmentShader = MicroappRenderer.loadShader(GLES20.GL_FRAGMENT_SHADER,
                                fragmentShaderCode);

// create empty OpenGL ES Program
mProgram = GLES20.glCreateProgram();

// add the vertex shader to program
GLES20.glAttachShader(mProgram, vertexShader);

// add the fragment shader to program
GLES20.glAttachShader(mProgram, fragmentShader);

// creates OpenGL ES program executables
GLES20.glLinkProgram(mProgram);