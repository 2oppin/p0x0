super(context);

// Create an OpenGL ES 2.0 context
setEGLContextClientVersion(2);

renderer = new MicroappRenderer();

// Set the Renderer for drawing on the GLSurfaceView
setRenderer(renderer);

// Render the view only when there is a change in the drawing data
setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);