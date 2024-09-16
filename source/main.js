
///import { App } from "./modules/app";
import "/assets/styles/media.scss"
import "/assets/styles/main.scss"
import "/assets/styles/fonts.scss"
import "/assets/styles//app.scss"
import "/assets/styles/header.scss"
import "/assets/styles/content.scss"
import "/assets/styles/footer.scss"
import "/assets/styles/dark-menu.scss"
import "/assets/styles/form.scss"

let GetOffset = ( element, offset ) => {

	if( element == document.body )
		return offset;

	return GetOffset( element.parentNode, (parseInt( offset ) || 0) + element.offsetTop );
};

class Scroller{

	p_list = [];
	p_index = 0;
	p_interval = null;
	p_timeout = null;

	constructor(){

		let self = this;
		let touchStartOffset = 0;
		let listener = ( event ) => {
			event.preventDefault();
			event.stopPropagation();
			self.event( event );
		};		
		let touchStartListener = ( event ) => {
			touchStartOffset = event.touches[ 0 ].screenY;
		};		
		let touchListener = ( event ) => {

			let delta = (event.touches[ 0 ].screenY - touchStartOffset);

			if( delta < -40 ){
				event.deltaY = 120;
				touchStartOffset = event.touches[ 0 ].screenY;
				self.event( event );
			}else if( delta > 40 ){
				event.deltaY = -120;
				touchStartOffset = event.touches[ 0 ].screenY;
				self.event( event );
			};

			event.preventDefault();
			event.stopPropagation();

		};
		this.create = () => {
			document.addEventListener( "mousewheel", listener, { passive: false } );
			document.addEventListener( "touchstart", touchStartListener, { passive: false } );
			document.addEventListener( "touchmove", touchListener, { passive: false } );
		};	
		this.destroy = () => {
			document.removeEventListener( "mousewheel", listener, { passive: false } );
			document.removeEventListener( "touchstart", touchStartListener, { passive: false } );
			document.removeEventListener( "touchmove", touchListener, { passive: false } );
		};

	};
	
	animateStop(){
		clearInterval( this.p_interval );
		this.p_interval = null;		
		clearInterval( this.p_timeout );
		this.p_timeout = null;
	};
	animateStart( offsetTop ){

		this.animateStop();
		let time = 320;
		let intervalTime = 8;
		let step = (offsetTop - document.body.scrollTop) / (time / intervalTime);
		
		this.p_timeout = setTimeout(() => {
			document.body.scrollTop = offsetTop;
			this.animateStop();
		}, time );
		this.p_interval = setInterval(() => {
			document.body.scrollTop += step;

			if( step >= 0 && document.body.scrollTop >= offsetTop ){
				document.body.scrollTop = offsetTop;
				this.animateStop();
			}else if( step <= 0 && document.body.scrollTop <= offsetTop ){
				document.body.scrollTop = offsetTop;
				this.animateStop();
			};

			console.log( step, document.body.scrollTop, offsetTop );

		}, intervalTime );

	};
	event( event ){

		if( this.p_interval )
			return;

		let index = this.p_index;

		if( event.deltaY > 0 )
			index++;
		if( event.deltaY < 0 )
			index--;

		if( index < 0 )
			index = 0;
		if( index >= this.p_list.length )
			index = this.p_list.length - 1;

		this.p_index = index;
		
		let offsetTop = GetOffset( this.p_list[ index ] );
		this.animateStart( offsetTop );

	};
	
	set( array ){
		this.destroy();
		this.p_list = array;
		this.p_index = 0;
		this.create();
	};

};

let ScrollerInstance = new Scroller();

let Render = () => {
	let elems = [];

	elems.push( document.getElementsByClassName( "head" )[ 0 ] );
	elems.push( document.getElementsByClassName( "promo" )[ 0 ] );
	elems.push( document.getElementsByClassName( "promo" )[ 1 ] );
	elems.push( document.getElementsByClassName( "footer" )[ 0 ] );

	ScrollerInstance.set( elems );

};
Render();


//root.render(<App/>);



