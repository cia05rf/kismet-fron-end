
function DestroyBackground(ctx, dims){
    if(ctx){
        // Clear existing drawings from canvas
        ctx.clearRect(0, 0, dims.width, dims.height);
        console.log("DESTORY CTX")
    }
}

export default DestroyBackground;
