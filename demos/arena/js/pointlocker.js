
// Note: at the time of writing, only Mozilla and WebKit support Pointer Lock.
// The element we'll make fullscreen and pointer locked.
// Based on https://developer.mozilla.org/en-US/docs/WebAPI/Pointer_Lock

function lockPointer(elem, callback) 
{
	// Start by going fullscreen with the element. Current implementations
	// require the element to be in fullscreen before requesting pointer
	// lock--something that will likely change in the future.
	elem.requestFullscreen = 	elem.requestFullscreen ||
								elem.mozRequestFullscreen ||
								elem.mozRequestFullScreen || // Older API upper case 'S'.
								elem.webkitRequestFullscreen;
	elem.requestFullscreen();

	function fullscreenChange() 
	{
		if (document.webkitFullscreenElement === elem ||
			document.mozFullscreenElement === elem ||
			document.mozFullScreenElement === elem) 
		{ // Older API upper case 'S'.
			
			// Element is fullscreen, now we can request pointer lock
			elem.requestPointerLock = 	elem.requestPointerLock ||
										elem.mozRequestPointerLock ||
										elem.webkitRequestPointerLock;
			elem.requestPointerLock();
		}
	}

	document.addEventListener('fullscreenchange', fullscreenChange, false);
	document.addEventListener('mozfullscreenchange', fullscreenChange, false);
	document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
	document.addEventListener("mousemove", handleMouseMove, false);

	function pointerLockChange() 
	{
		if (document.mozPointerLockElement === elem || document.webkitPointerLockElement === elem || document.pointerLockElement) 
		{
			document.addEventListener("mousemove", handleMouseMove, false);
		}
		else 
		{
			document.removeEventListener('mousemove', handleMouseMove);
		}		
	}

	document.addEventListener('pointerlockchange', pointerLockChange, false);
	document.addEventListener('mozpointerlockchange', pointerLockChange, false);
	document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

	function pointerLockError() 
	{
		document.removeEventListener('mousemove', handleMouseMove);
	}

	document.addEventListener('pointerlockerror', pointerLockError, false);
	document.addEventListener('mozpointerlockerror', pointerLockError, false);
	document.addEventListener('webkitpointerlockerror', pointerLockError, false);

	function handleMouseMove(e) 
	{
		var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0, movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

		typeof callback === 'function' && callback({
			x: movementX,
			y: movementY
		});
	}
}

function pointerRelease()
{
	if(document.exitFullscreen) 
	{
		document.exitFullscreen();
	}
	else if(document.mozCancelFullScreen) 
	{
		document.mozCancelFullScreen();
	}
	else if(document.webkitExitFullscreen) 
	{
		document.webkitExitFullscreen();
	}
	// Cancel fullscreen for browsers that support it!
}

