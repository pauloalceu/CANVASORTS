
		var sort = function(canvasId, strokeStyle, canvasSize){
			this.canvasId 		= canvasId;
			this.arraySize 		= canvasSize;
			this.canvasWidth 	= canvasSize;
			this.canvasHeight 	= canvasSize;

			if(!document.getElementById(canvasId)){
				alert('Canvas not found: ' + canvasId);
				return;
			}
			this.canvas = document.getElementById(canvasId);
			this.canvas.width 	= this.canvasWidth;
			this.canvas.height 	= this.canvasHeight;

			if(!this.canvas.getContext){
				alert('Canvas not supported!');
				return;
			}
			this.context = this.canvas.getContext("2d");
			this.context.lineWidth 		= 1;
			this.context.strokeStyle 	= strokeStyle;

			//initialize our array of values
			this.values = this.getValues(this.arraySize);
		}

		//initialize an array of N numbers
		sort.prototype.getValues = function(numElements){
			for (var a=[],i=0;i<numElements;++i) a[i]=i;
			return this.shuffle(a);	
		}

		//randomize the values in the array
		sort.prototype.shuffle = function(array){
			var tmp, current, top = array.length;
			if(top) while(--top) {
				current = Math.floor(Math.random() * (top + 1));
				tmp = array[current];
				array[current] = array[top];
				array[top] = tmp;
			}
			return array;
		}

		//this function renders each value as a line
		//we use the magnitude of the value at element N is used as the length of the line
		//we use the index as the position of the line (all lines are veritcal)
		sort.prototype.draw = function(){
			//clear canvas
			this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

			//draw each of the values as a line 
			for (var i = 0; i < this.values.length; i++) {
				this.context.beginPath();
				this.context.moveTo(0, i+0.5);
				this.context.lineTo(this.values[i], i+0.5);
				this.context.stroke();
			}
		}

		//sort the array of values, and each time a swap occurs, redraw the values on the canvas
		//sort using a BUBBLE SORT algorithm
		sort.prototype.bubbleSort = function(){
			var swapped = false;

			//pass through the array and swap the first unordered value you find with its neighbour
			sort.prototype.bubbleSortPass = function(i){
				if (this.values[i] > this.values[i+1]) {
					var temp 			= this.values[i];
					this.values[i] 		= this.values[i+1];
					this.values[i+1] 	= temp;

					swapped = true;

					this.draw();
				}				

				//save the context so that we can call the functions with setTimeout in the context of our object
				var self = this;

				//These are our "loop" conditionals
				if(i<this.values.length){
					//if i<this.values.length, we are not yet at the end of our pass through the array (inner loop)
					setTimeout(function(){self.bubbleSortPass(i+1);}, 5);
				}else{
					//if i=this.values.length then we have completed a pass through the array
					//we check if any values were swapped during the last pass
					//if no, the array is sorted
					//if yes, then we need to do another pass
					if(swapped){setTimeout(function(){self.bubbleSort();}, 5);}
				}				
			}

			this.bubbleSortPass(0);
		}

		//sort the array of values, and each time a swap occurs, redraw the values on the canvas
		//sort using a SELECTION SORT algorithm
		sort.prototype.selectionSort = function(i){
			// current smallest value in the array
			var smallestValueIndex = i;

			// check against all other values
			for (var k = i+1; k < this.arraySize; k++) {

				// new small value, reference its position
				if (compare( this.values[k], this.values[smallestValueIndex]) === true) {
					smallestValueIndex = k;
				}
			}

			// a new smallest value was assigned, perform a swap !
			if (smallestValueIndex !== i) {
				var tmp 		= this.values[i];
				this.values[i] 	= this.values[smallestValueIndex];
				this.values[smallestValueIndex] = tmp;

				this.draw();
			}

			function compare(a, b) {
				return a < b ? true : b;
			}

			var self = this;
			if(i<this.arraySize){setTimeout(function(){self.selectionSort(i+1);}, 5);}	
		}

		//sort the array of values, and each time a swap occurs, redraw the values on the canvas
		//fort using an INSERTION SORT algorithm
		sort.prototype.insertionSort = function(){
    		var len = this.values.length, i = -1, j, tmp;
 
			while (len--) {
				tmp = this.values[++i];
				j = i;

				sort.prototype.insertionSortPass = function(j){
					if(this.values[j]>tmp && j>=0){
						this.values[j + 1] = this.values[j];
						this.values[j] = tmp;

						this.draw();

						var self = this;
						
						//totally fucked - why doesn't this work???
						//setTimeout(function(){self.insertionSortPass(j-1);},200);

						//works, but UI is locked until the thread exits
						self.insertionSortPass(j-1);
					}
				}
				this.insertionSortPass(j-1);
			}
		}

		$(document).ready(function(){

			var bubSort = new sort('canvas-bubble-sort','rgb(255,0,0)', 250);
			bubSort.draw();

			var selSort = new sort('canvas-selection-sort','rgb(0,255,0)', 250);
			selSort.draw();

			var insSort = new sort('canvas-insert-sort', 'rgb(0,0,255)', 250);
			insSort.draw();


			$("#btnBubbleSort").click(function(){
				bubSort.bubbleSort();
			});

			$("#btnSelectionSort").click(function(){
				selSort.selectionSort(0);
			});	

			$("#btnInsertionSort").click(function(){
				insSort.insertionSort();
			});
		});