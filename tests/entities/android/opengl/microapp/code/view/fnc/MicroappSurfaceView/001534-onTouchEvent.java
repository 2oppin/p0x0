// MotionEvent reports input details from the touch screen
// and other input controls. In this case, you are only
// interested in events where the touch position changed.

float x = e.getX();
float y = e.getY();

switch (e.getAction()) {
    case MotionEvent.ACTION_MOVE:
        float dx = x - previousX;
        float dy = y - previousY;
        // reverse direction of rotation above the mid-line
        if (y < getHeight() / 2) {
             dx = dx * -1 ;
        }
        // reverse direction of rotation to left of the mid-line
        if (x > getWidth() / 2) {
            dy = dy * -1 ;
        }
        renderer.setAngle(
                renderer.getAngle() +
                ((dx + dy) * TOUCH_SCALE_FACTOR));
        requestRender();
}
previousX = x;
previousY = y;


return true;