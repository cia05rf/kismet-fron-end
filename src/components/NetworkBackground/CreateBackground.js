// Create a colour mask
const _getColor = ( x, width, frame ) => {
    return 'hsl( hue, 80%, 50% )'.replace(
        'hue', x / width * 360 + frame
    );
}

// Create a line
class Line{
    constructor(parent){
        // Assign line position values
        this.x1 = parent.x1 | 0;
        this.y1 = parent.y1 | 0;
        this.x2 = parent.x1 | 0;
        this.y2 = parent.y1 | 0;
        // Adjust width
        this.lineWidth = parent.lineWidth / 1.25;
        this.dirs = parent.dirs;
        this.maxDist = parent.maxDist;
        this.minDist = parent.minDist;
        this.speed = parent.speed;

        do{
            // Choose a direction of travel
            var dir = this.dirs[ ( Math.random() * this.dirs.length ) | 0 ];
            this.vx = dir[ 0 ];
            this.vy = dir[ 1 ];

        }while(
            ( this.vx === -parent.vx && this.vy === -parent.vy ) || ( this.vx === parent.vx && this.vy === parent.vy)
        );
        
        // Establish the directional velocity
        this.vx *= this.speed;
        this.vy *= this.speed;
    
        // Establish the distance after which children can be made
        this.dist = ( Math.random() * ( this.maxDist - this.minDist ) + this.minDist );
    }

    // Add a step for each line to take (getting dimmer, splitting etc)
    step(){
        this.x2 += this.vx;
        this.y2 += this.vy;
        
        --this.dist;
        
        // var dead = false;

        // // kill if out of screen
        // if( this.x < 0 || this.x > parent.width || this.y < 0 || this.y > parent.height )
        // dead = true;

        // // make children :D
        // if( this.dist <= 0 && this.lineWidth > 1 ) {

        //     // keep yo self, sometimes
        //     this.dist = Math.random() * ( parent.maxDist - parent.minDist ) + parent.minDist;

        //     // add 2 children
        //     if( this.lines.length < parent.maxLines ) parent.lines.push( new Line( this ) );
        //     if( this.lines.length < parent.maxLines && Math.random() < .5 ) parent.lines.push( new Line( this ) );


        //     // kill the poor thing
        //     if( Math.random() < .2 ) dead = true;
        // }
  
        // // Extend the line
        // ctx.strokeStyle = ctx.shadowColor = getColor( this.x );
        // ctx.beginPath();
        // ctx.lineWidth = this.width;
        // ctx.moveTo( this.x, this.y );
        // ctx.lineTo( prevX, prevY );
        // ctx.stroke();

        // if( dead ) return true
    }

    endStep(){
        // Bring co-ords together
        this.x1 = this.x2;
        this.y1 = this.y2;
    }
}

class LinesGenerator{
    constructor(targetRef, height, width){
        this.targetRef = targetRef;
        this.ctx = null;
        this.height = height;
        this.width = width;
        this.maxLines = 100;
        this.initialLines = 4;
        this.lines = [];
        this.frame = 0;
        this.timeSinceLast = 0;
        //Line vars
        this.starter = { // starting parent line, just a pseudo line
            x1: this.width / 2,
            y1: this.height / 2,
            x2: this.width / 2,
            y2: this.height / 2,
            vx: 0,
            vy: 0,
            lineWidth: 10,
            speed:5,
            dirs: [
                // straight x, y velocity
                [ 0, 1 ],
                [ 1, 0 ],
                [ 0, -1 ],
                [ -1, 0 ],
                // diagonals, 0.7 = sin(PI/4) = cos(PI/4)
                [ .7, .7 ],
                [ .7, -.7 ],
                [ -.7, .7 ],
                [ -.7, -.7]
            ],
            minDist: 10,
            maxDist: 30
        };
    }

    // ROB - YOU ARE NOT ABLE TO ADD CHILD LINES IT SEEMS - ALSO LINES DIE TOO SOON
    _spawnChildLines(thisLine){
        let spawnChild = 0;
        let randomKill = false;
        // make children :D
        if( thisLine.dist <= 0 && thisLine.lineWidth > 1 ) {
            
            // keep yo self, sometimes
            thisLine.dist = Math.random() * ( this.maxDist - this.minDist ) + this.minDist;
            
            // add 2 children
            if( this.lines.length < this.maxLines ) ++spawnChild;
            if( this.lines.length < this.maxLines && Math.random() < .5 ) ++spawnChild;

            // Allow random killing
            randomKill = true
        }
        // Spawn the children
        for(let i=0; i < spawnChild; i++){
            this.lines.push(new Line(thisLine))
        }

        return {spawnChild, randomKill}
    }

    _killLine(thisLine, randomKill=false){
        let dead = false;
        // kill if out of screen
        if( thisLine.x2 < 0 || thisLine.x2 > this.width || thisLine.y2 < 0 || thisLine.y2 > this.height )
        dead = true;
        // randomly kill
        if( randomKill && Math.random() < .2 ) dead = true;
        return dead;
    }

    _extendLine(thisLine){
        // Draw the line
        this.ctx.strokeStyle = this.ctx.shadowColor = _getColor( thisLine.x2, this.width, this.frame );
        this.ctx.beginPath();
        this.ctx.lineWidth = thisLine.lineWidth;
        this.ctx.moveTo( thisLine.x2, thisLine.y2 );
        this.ctx.lineTo( thisLine.x1, thisLine.y1 );
        this.ctx.stroke();
    }

    _step(){
        for( var i = 0; i < this.lines.length; ++i ) {
            const thisLine = this.lines[ i ];
            // Move the line on one step
            thisLine.step()

            // Spawn children
            const {_, randomKill} = this._spawnChildLines( thisLine )

            // Extend line
            this._extendLine(thisLine)

            // Update the position variables
            thisLine.endStep()

            // Check if should be killed
            if( this._killLine(thisLine, randomKill)) { // if true it's dead
                this.lines.splice( i, 1 );
                // Decement the index to account for lost thisLine
                --i;
            }
        }

        // Spawn new lines from origin
        ++this.timeSinceLast
        if( this.lines.length < this.maxLines && this.timeSinceLast > 10 && Math.random() < .5 ) {
            this.timeSinceLast = 0;
            this.lines.push( new Line( this.starter ) );
            // // cover the middle;
            // this.ctx.fillStyle = this.ctx.shadowColor = _getColor( this.starter.x, this.width, this.frame );
            // this.ctx.beginPath();
            // this.ctx.arc( this.starter.x1, this.starter.y1, this.initialWidth, 0, Math.PI * 2 );
            // this.ctx.fill();
        }
    }

    // Setup the context and line styles
    _init(){
        this.lines.length = 0;
        
        for( var i = 0; i < this.initialLines; ++i ){
            this.lines.push( new Line( this.starter ) );
        }
        
        // Create background
        if(!this.ctx){
            this.ctx = this.targetRef.current.getContext( '2d' );
        }
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect( 0, 0, this.width, this.height );
        
        // if you want a cookie ;)
        this.ctx.lineCap = 'round';
    }
        
    // Animate the lines
    _anim() {

        // Kill switch
        // if(this.frame > 100){
        //     console.log("KILL SWITCH")
        //     this.ctx = null;
        //     return;
        // }
   
        window.requestAnimationFrame( () => this._anim() );

        ++this.frame;

        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(255,255,255,.02)';
        this.ctx.fillRect( 0, 0, this.width, this.height );
        this.ctx.shadowBlur = .5;

        this._step()
    }

    CreateBackground = () => {

        this._init();
        this._anim();
    }

    // Stop the animation - existing lines will fade out
    stopAnim(){
        console.log("STOP ANIM")
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx = null;
    }
}

export default LinesGenerator;
