
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
				alert('Canvas não suportada!!');
				return;
			}
			this.context = this.canvas.getContext("2d");
			this.context.lineWidth 		= 1;
			this.context.strokeStyle 	= strokeStyle;

			//inicializar nosso array de valores
			this.values = this.getValues(this.arraySize);
		}

		//inicializar uma matriz de N números
		sort.prototype.getValues = function(numElements){
			for (var a=[],i=0;i<numElements;++i) a[i]=i;
			return this.shuffle(a);	
		}

		//randomizar os valores na matriz
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

		//esta função renderiza cada valor como uma linha
		//usamos a magnitude do valor no elemento N é usado como o comprimento da linha
		//usamos o índice como a posição da linha (todas as linhas são verticais)
		sort.prototype.draw = function(){
			//limpa canvas
			this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

			//desenhe cada um dos valores como uma linha
			for (var i = 0; i < this.values.length; i++) {
				this.context.beginPath();
				this.context.moveTo(0, i+0.5);
				this.context.lineTo(this.values[i], i+0.5);
				this.context.stroke();
			}
		}

		//classifique a matriz de valores e, sempre que ocorrer uma troca, redesenhe os valores na tela
		//classificar usando um algoritmo BUBBLE SORT
		sort.prototype.bubbleSort = function(){
			var swapped = false;

			//passe pelo array e troque o primeiro valor não ordenado que você encontrar com seu vizinho
			sort.prototype.bubbleSortPass = function(i){
				if (this.values[i] > this.values[i+1]) {
					var temp 			= this.values[i];
					this.values[i] 		= this.values[i+1];
					this.values[i+1] 	= temp;

					swapped = true;

					this.draw();
				}				

				//salve o contexto para que possamos chamar as funções com setTimeout no contexto do nosso objeto
				var self = this;

				//Estas são as nossas condicionais de "loop"
				if(i<this.values.length){
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
    		var len = this.values.length, x = -1, y, tmp;
 
			while (len--) {
				tmp = this.values[++x];
				y = x;

				sort.prototype.insertionSortPass = function(y){
					if(this.values[y]>tmp && y>=0){
						this.values[y + 1] = this.values[y];
						this.values[y] = tmp;

						this.draw();

						var self = this;
						
						setTimeout(function(){self.insertionSort(y-1);},20);
					}
				}
				this.insertionSortPass(y-1);
				
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