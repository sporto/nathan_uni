var compile = function(musexpr) {
    var arr = [];

    function add(node, start){
		var dur = 0;
		var seq = node.tag==='seq';
		var leftDur = 0;
		var rightDur = 0;
		
		if(node.dur) {
			arr.push({tag:'note', pitch:node.pitch, start:start, dur:node.dur});
			return node.dur;
		}
		if(node.left) leftDur = add(node.left, start);
		if(node.right) rightDur = add(node.right, seq? leftDur:start);
		
		if(seq){
			dur=leftDur+rightDur;
		}else{
			dur=Math.max(leftDur, rightDur);
		}
		
		return dur;
	}
	
	add(musexpr, 0);
	return arr;
    
};