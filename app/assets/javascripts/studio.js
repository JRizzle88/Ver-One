var stage;
var update = true;

function initStudio() {
	stage = new Stage(document.getElementById("studio-canvas"));
	stage.width = document.getElementById("studio-canvas").width;
	stage.height = document.getElementById("studio-canvas").height;
	stage.enableMouseOver();
	Touch.enable(stage);
	stage.update();
	Ticker.addListener(window);
	if (window.location.href.indexOf("herokuapp") == -1) {
		if (window.location.search.indexOf("product") !== -1) {
			var pathname = window.location.search;
			function urlParam(pathname){
			    var results = new RegExp('[\\?&]' + pathname + '=([^&#]*)').exec(window.location.href);
			    return results[1] || 0;
			}
			// test with this URL for product load - http://localhost:3000/?productID=7&colorID=14
			// test with this URL for design - http://localhost:3000/?designID=3345
			initializeProductFromURL(decodeURIComponent(urlParam('productID')), decodeURIComponent(urlParam('colorID')));
		} else if (window.location.search.indexOf("design") !== -1) {
			console.log("design is in the url");
		} else {
			initializeProductFromURL(7, 254);
			console.log("the else was run");
		}
	} else {
		initializeProductFromURL(4, 254);
	}
}

function chainSelects() {
	var category = $("#maincats").val();
	$.ajax({
		dataType: "json",
		type: 'POST',
		cache: false,
		url: 'subcategories/' + category,
		timeout: 4000,
		error: function(XMLHttpRequest, errorTextStatus, error){
			alert("Failed to submit : " + errorTextStatus + " - " + error);
		},
		success: function(data){
			$("#subcats option").remove();
			$.each(data, function(i, j){
				row = "<option id=\""+ j.id + "\" value=\"" + j.id + "\">" + j.subcategory + "</option>";
				$(row).appendTo("#subcats");                    
			});
		displayVals();          
		}
	});
}

function displayVals() {
	var subcatID = $("#subcats").val();
	$.ajax({
		dataType: "json",
		type: 'POST',
		cache: false,
		url: 'clipart/' + subcatID,
		timeout: 4000,
		error: function(XMLHttpRequest, errorTextStatus, error){
			alert("Failed to submit : " + errorTextStatus + " - " + error);
		},
		success: function(data){
			// Clear all subcategory images
			$('#imageDiv img').remove();
			$('.clip').off('click');                  
			// Load subcategory images
			$.each(data, function(i, j){
				clipartImage = '<img class="clip" id="' + j.id + '"src="assets/studio/clipart/' + j.clipart + '" width="50px" />';  
				$(clipartImage).appendTo("#imageDiv");
			});
		$('.clip').click(function(){addToCanvas(this.id);}); 
		}
	});
}

function chainFontSelects() {
	var category = $("#fontCats").val();
	if (category == 0){
		$('#fonts').css("visibility","hidden");
		return;
	} else {
		$.ajax({
			dataType: "json",
			type: 'POST',
			cache: false,
			url: 'fonts/' + category,
			timeout: 4000,
			error: function(XMLHttpRequest, errorTextStatus, error){
				alert("Failed to submit : " + errorTextStatus + " - " + error);
			},
			success: function(data){
				$("#fonts option").remove();
				var blankRow = '<option value="0">- Select A Font -</option>';
				$(blankRow).appendTo("#fonts");
				$.each(data, function(i, j){
					// row = "<option value=\"" + j.id + "\">" + j.name + "</option>";
					row = '<option style="background:url(assets/studio/fontImages/' + j.image + '.jpg) no-repeat white;height:30px;cursor:pointer;" value="' + j.name + '"></option>';
					$(row).appendTo("#fonts");                    
				});
			$('#fonts').css({'visibility' : 'visible' , 'height' : '35px'});   
			}
		});
	}
}

var fontSelected;

function displayFonts() {
	fontSelected = $('#fonts').val();
	if (fontSelected == 0){
		return;
	} else {
		$.ajax({
			dataType: "json",
			type: 'POST',
			cache: false,
			url: 'load-font/' + fontSelected,
			timeout: 8000,
			error: function(XMLHttpRequest, errorTextStatus, error){
				alert("Failed to submit : " + errorTextStatus + " - " + error);
			},
			success: function(data){
				$.each(data, function(i, j){
					$('#fonts').css({'background' : 'url(assets/studio/fontImages/' + j.image + '.jpg) no-repeat white'});
					var font = new Font;
					font.fontFamily = fontSelected;
					font.src = "assets/fonts/" + j.folder + "/" + j.filename + ".ttf";
					font.onload = function () {
						console.log("the font loaded");
					};
				});     
			}
		});
	}
}

var currentProduct;
var currentProductID;
var currentProductColor = "CC0000";
var sizeContainer;

function initializeProductFromURL(productID, colorID) {
	currentProductID = productID;
	$.ajax({
		dataType: "json",
		type: 'POST',
		cache: false,
		url: 'productColor/' + colorID,
		timeout: 8000,
		error: function(XMLHttpRequest, errorTextStatus, error){
			alert("Failed to submit : " + errorTextStatus + " - " + error);
		},
		success: function(data){
			currentProductColor = data.hex;
			$.ajax({
				dataType: "json",
				type: 'POST',
				cache: false,
				url: 'product/' + productID,
				timeout: 8000,
				error: function(XMLHttpRequest, errorTextStatus, error){
					alert("Failed to submit : " + errorTextStatus + " - " + error);
				},
				success: function(data){
					var R = hexToR(currentProductColor);
					var G = hexToG(currentProductColor);
					var B = hexToB(currentProductColor);
					if (data.frontImageTwo !== "") {
						var frontImageTwo = new Image();
						frontImageTwo.src = "assets/studio/products/" + data.frontImageTwo;
						frontImageTwo.onload = function handleFrontImageTwo() {
							var bitmapFrontTwo = new Bitmap(frontImageTwo);
							bitmapFrontTwo.x = 0;
							bitmapFrontTwo.y = 0;
							stage.addChild(bitmapFrontTwo);
						}
					}
					var frontImageOne = new Image();
					frontImageOne.onload = handleProdImgLoad;
					frontImageOne.src = "assets/studio/products/" + data.frontImageOne;
					function handleProdImgLoad() {
					var bitmapFrontOne = new Bitmap(frontImageOne);
					bitmapFrontOne.x = 0;
					bitmapFrontOne.y = 0;
					var colorScaleFilter = new ColorMatrixFilter([
						R/255,0,0,0,0, // red
						0,G/255,0,0,0, // green
						0,0,B/255,0,0, // blue
						0,0,0,1,0 // alpha
					]);
					$('#product-name').html(data.name);
					$('#product-description').html(data.description);
					$.each(data.product_colors, function(k, v) {
						swatch = '<a id="' + v.hex + '" class="product-swatch" title="' + v.name + '" style="background-color:#' + v.hex + ';" onclick="changeProductColor(this)"> </a>';
						$(swatch).appendTo('#prod-swatches');
				  	});
					console.log(data);
					$.each(data.sizes, function(k, v) {
						sizeContainer = '<span class="sizeEntry">' + v.abbreviated + ' <input type="text" id="' + v.abbreviated + '" onchange="getPriceQuote(this);" /></span>';
						$(sizeContainer).appendTo('#quote-form');
				  	});
					bitmapFrontOne.filters = [colorScaleFilter];
					bitmapFrontOne.cache(1,1,425,500);
					stage.addChild(bitmapFrontOne);
					stage.update();
					currentProduct = bitmapFrontOne;
					}
				}
			});    
		}
	});
}

// function initializeProduct() {
// 	console.log("initializeProduct was called");
// 	var R = hexToR(currentProductColor);
// 	var G = hexToG(currentProductColor);
// 	var B = hexToB(currentProductColor);
// 	var imgDead = new Image();
// 	imgDead.onload = handleProdImgDeadLoad;
// 	imgDead.src = "assets/studio/products/koozie-test-425px-foam.png";
// 	function handleProdImgDeadLoad() {
// 		var bitmapDead = new Bitmap(imgDead);
// 		bitmapDead.x = 0;
// 		bitmapDead.y = 0;
// 		stage.addChild(bitmapDead);
// 	}
// 	var img = new Image();
// 	img.onload = handleProdImgLoad;
// 	img.src = "assets/studio/products/koozie-test-425px-text.png";
// 	function handleProdImgLoad() {
// 		var bitmap = new Bitmap(img);
// 		bitmap.x = 0;
// 		bitmap.y = 0;
// 		var colorScaleFilter = new ColorMatrixFilter([
// 			R/255,0,0,0,0, // red
// 			0,G/255,0,0,0, // green
// 			0,0,B/255,0,0, // blue
// 			0,0,0,1,0 // alpha
// 		]);
// 		bitmap.filters = [colorScaleFilter];
// 		bitmap.cache(1,1,425,500);
// 		stage.addChild(bitmap);
// 		stage.update();
// 		currentProduct = bitmap;
// 	}
// }

function hexToR(h) {return parseInt((h).substring(0,2),16)}
function hexToG(h) {return parseInt((h).substring(2,4),16)}
function hexToB(h) {return parseInt((h).substring(4,6),16)}

function changeProductColor(elem) {
	currentProductColor = $(elem).attr('id');
	var R = hexToR(currentProductColor);
	var G = hexToG(currentProductColor);
	var B = hexToB(currentProductColor);
	var colorScaleFilter = new ColorMatrixFilter([
		R/255,0,0,0,0, // red
		0,G/255,0,0,0, // green
		0,0,B/255,0,0, // blue
		0,0,0,1,0 // alpha
	]);
	currentProduct.filters = [colorScaleFilter];
	currentProduct.updateCache();
	stage.update();
}

var currentColor = "000000";
var currentColorName = "Black";
var currentFilter;

function selectColor(elem) {
	currentColorName = $(elem).attr('id');
	$.ajax({
		dataType: "json",
		type: 'POST',
		cache: false,
		url: 'designcolor/' + currentColorName,
		timeout: 4000,
		error: function(XMLHttpRequest, errorTextStatus, error){
			alert("Failed to submit : " + errorTextStatus + " - " + error);
		},
		success: function(data){
			$.each(data, function(i, j) {
				if (!currentClipart){
					currentFilter = [new ColorFilter(j.rValue,j.gValue,j.bValue,1)];
					currentColor = j.designhex;
					console.log(currentColor);
					return;
				} else {
					currentClipart.filters = [new ColorFilter(j.rValue,j.gValue,j.bValue,1)];
					currentColor = j.designhex;
					console.log(currentColor + " from the else portion.");
					currentClipart.updateCache();
					currentFilter = currentClipart.filters;
					update = true;
				}
			});
		}	
	});
}

var deleteButton;
var currentClipart;
var frontClipart = {};
var artCounter = 1;

function addToCanvas(imageID) {
	$.ajax({
		dataType: "json",
		type: 'POST',
		cache: false,
		url: 'canvas-clipart/' + imageID,
		timeout: 4000,
		error: function(XMLHttpRequest, errorTextStatus, error){
			alert("Failed to submit : " + errorTextStatus + " - " + error);
		},
		success: function(data){
			$.each(data, function(i, j) {
				var img = new Image();
				img.onload = handleImgLoad;
				img.src = "assets/studio/clipart/white/" + j.clipart;
				function handleImgLoad() {
					var bitmap = new Bitmap(img);
					bitmap.x = 30;
					bitmap.y = 40;
					bitmap.scaleX = .5;
					bitmap.scaleY = .5;
					bitmap.onPress = handlePress;
					bitmap.onMouseOver = handleMouseOver;
					bitmap.onMouseOut = handleMouseOut;
					if (!currentFilter){
						bitmap.filters = [new ColorFilter(0,0,0,1)];
					} else {
						bitmap.filters = currentFilter;
					}
					bitmap.cache(0,0,500,500);
					stage.addChild(bitmap);
					frontClipart[artCounter] = {};
					frontClipart[artCounter]['file'] = j.clipart;
					frontClipart[artCounter]['x'] = bitmap.x;
					frontClipart[artCounter]['y'] = bitmap.y;
					artCounter = artCounter + 1;
					if (!deleteButton) {
						deleteButton = new Bitmap("assets/studio/delete-button.png");
						deleteButton.x = bitmap.x;
						deleteButton.y = bitmap.y;
						deleteButton.visible = false;
						deleteButton.name = "Delete Button";
						deleteButton.onPress = handleDelete;
						stage.addChild(deleteButton);
						sizeUp = new Bitmap("assets/studio/size-up.png");
						sizeUp.x = bitmap.x;
						sizeUp.y = bitmap.y + 40;
						sizeUp.visible = false;
						sizeUp.name = "Size Up";
						sizeUp.onPress = handleSizeUp;
						stage.addChild(sizeUp);
						sizeDown = new Bitmap("assets/studio/size-down.png");
						sizeDown.x = bitmap.x;
						sizeDown.y = bitmap.y + 75;
						sizeDown.visible = false;
						sizeDown.name = "Size Down";
						sizeDown.onPress = handleSizeDown;
						stage.addChild(sizeDown);
					}
					stage.update();
					currentClipart = bitmap;
					console.log(frontClipart);
				}
			}); 
		}
	});
}

var offset = new Point();
var lastClipart;

function handleMouseUp(event) {
	lastClipart = currentClipart;
    currentClipart = event.target;
    if (currentClipart == null) { return; }
    currentClipart.shadow = null;
	deleteButton.visible = false;
	sizeUp.visible = false;
	sizeDown.visible = false;
    update = true;
    currentClipart.isMouseDown = false;
}

function handlePress(event) {
    currentClipart = event.target;
    currentClipart.shadow = new Shadow('#00FF00', 0, 0, 5);
    currentClipart.isMouseDown = true;
	deleteButton.visible = true;
	sizeUp.visible = true;
	sizeDown.visible = true;
    update = true;
    currentClipart.oldX = currentClipart.x;
    currentClipart.oldY = currentClipart.y;
    event.onMouseMove = handleMove;
	// console.log("Clipart index - " + stage.getChildIndex(currentClipart));
}

function handleMove(event) {
	currentClipart.shadow = new Shadow('#00FF00', 0, 0, 5);
	deleteButton.visible = true;
	sizeUp.visible = true;
	sizeDown.visible = true;
    currentClipart.x = event.stageX + (offset.x - 30);
    currentClipart.y = event.stageY + (offset.y - 30);
	deleteButton.x = currentClipart.x - 10;
	deleteButton.y = currentClipart.y;
	sizeUp.x = currentClipart.x - 10;
	sizeUp.y = currentClipart.y + 40;
	sizeDown.x = currentClipart.x - 10;
	sizeDown.y = currentClipart.y + 75;
    update = true;
}

function handleMouseOver(event) {
	currentClipart.shadow = null;
	currentClipart = event.target;
	currentClipart.shadow = new Shadow('#00FF00', 0, 0, 5);
	deleteButton.x = currentClipart.x - 10;
	deleteButton.y = currentClipart.y;
	sizeUp.x = currentClipart.x - 10;
	sizeUp.y = currentClipart.y + 40;
	sizeDown.x = currentClipart.x - 10;
	sizeDown.y = currentClipart.y + 75;
	deleteButton.visible = true;
	sizeUp.visible = true;
	sizeDown.visible = true;
	update = true;
}

function handleMouseOut(event) {
	Ticker.removeListener(checkCursorForFocus);
	Ticker.addListener(checkCursorForFocus);
	update = true;
}

function checkCursorForFocus(event) {
	var currentMouseX = stage.mouseX;
	var currentMouseY = stage.mouseY;
	var positiveX = currentClipart.x + 150;
	var negativeX = currentClipart.x - 50;
	var positiveY = currentClipart.y + 150;
	var negativeY = currentClipart.y - 50;
	if (currentMouseX > positiveX || currentMouseX < negativeX || currentMouseY > positiveY || currentMouseY < negativeY || !stage.mouseInBounds) {
		currentClipart.shadow = null;
		deleteButton.visible = false;
		sizeUp.visible = false;
		sizeDown.visible = false;
		update = true;
		Ticker.removeListener(checkCursorForFocus);
	}
}

function handleDelete(event) {
	var clipartToDelete = stage.getChildIndex(currentClipart);
	stage.removeChildAt(clipartToDelete);
	deleteButton.visible = false;
	sizeUp.visible = false;
	sizeDown.visible = false;
	Ticker.removeListener(checkCursorForFocus);
	update = true;
}

function handleSizeUp(event) {
	if (currentClipart.scaleX <= 2.5) {
		currentClipart.scaleX = currentClipart.scaleX + .05;
		currentClipart.scaleY = currentClipart.scaleY + .05;
	} else {
		alert("Any larger and we won't be able to print the image..");
	}
	update = true;
}

function handleSizeDown(event) {
	if (currentClipart.scaleX >= .05) {
		currentClipart.scaleX = currentClipart.scaleX - .05;
		currentClipart.scaleY = currentClipart.scaleY - .05;
	} else {
		alert("Any smaller and the image won't be visible.");
	}
	update = true;
}

// var frontText = { "frontText1" : { "text" : "", "x" : "", "y" : "", "font" : "", "color" : "" }, "frontText2" : { "text" : "", "x" : "", "y" : "", "font" : "", "color" : "" }, "frontText3" : { "text" : "", "x" : "", "y" : "", "font" : "", "color" : "" }, "frontText4" : { "text" : "", "x" : "", "y" : "", "font" : "", "color" : "" }, "frontText5" : { "text" : "", "x" : "", "y" : "", "font" : "", "color" : "" } }
var frontText = {};
var textCounter = 1;

window.namedItems = { };

function focusText(elem) {
	var currentId = $(elem).attr('id');
	if ($(elem).val() == "") {
		return;
	} else {
		for (var k in namedItems) {
			if (k == currentId){
				namedItems[currentId].shadow = new Shadow('#00FF00', 0, 0, 5);
				update = true;
			}
		}
	}
}

function noFocusText(elem) {
	console.log(frontText);
	var currentId = $(elem).attr('id');
	if ($(elem).val() == "") {
		return;
	} else if (namedItems[currentId] == null) {
		return;
	} else {
		for (var k in namedItems) {
			if (k == currentId){
				namedItems[currentId].shadow = null;
				update = true;
			}
		}
	}
}

var txtDeleteButton;
var txtSizeUp;
var txtSizeDown;

function addTextToCanvas(elem) {
	var currentId = $(elem).attr('id');
	if (namedItems[currentId] == null) {
		        txt = new Text($(elem).val(), "36px " + fontSelected, "#" + currentColor);
				txt.x = 40;
				txt.y = 80;
				frontText[textCounter] = {};
				frontText[textCounter]['text'] = $(elem).val();
				frontText[textCounter]['x'] = txt.x;
				frontText[textCounter]['y'] = txt.y;
				frontText[textCounter]['font'] = fontSelected;
				frontText[textCounter]['color'] = currentColor;
				textCounter = textCounter + 1;
				txt.onPress = handleTxtPress;
				txt.onMouseOver = handleTxtMouseOver;
				txt.onMouseOut = handleTxtMouseOut;
				namedItems[currentId] = txt; 
				stage.addChild(txt);
				currentTxt = txt;
				stage.update();
	} else {
		for (var k in namedItems) {
			if (k == currentId){
				namedItems[currentId].text = $(elem).val();
				namedItems[currentId].font = "36px " + fontSelected;
				namedItems[currentId].color = "#" + currentColor;
				update = true;
			}
		}
	}
	if (!txtDeleteButton) {
		txtDeleteButton = new Bitmap("assets/studio/delete-button.png");
		txtDeleteButton.x = txt.x;
		txtDeleteButton.y = txt.y;
		txtDeleteButton.visible = false;
		txtDeleteButton.name = "DeleteBtnTxt";
		txtDeleteButton.onPress = handleTxtDelete;
		stage.addChild(txtDeleteButton);
		txtSizeUp = new Bitmap("assets/studio/size-up.png");
		txtSizeUp.x = txt.x;
		txtSizeUp.y = txt.y + 40;
		txtSizeUp.visible = false;
		txtSizeUp.name = "SizeUpTxt";
		txtSizeUp.onPress = handleTxtSizeUp;
		stage.addChild(txtSizeUp);
		txtSizeDown = new Bitmap("assets/studio/size-down.png");
		txtSizeDown.x = txt.x;
		txtSizeDown.y = txt.y + 75;
		txtSizeDown.visible = false;
		txtSizeDown.name = "SizeDownTxt";
		txtSizeDown.onPress = handleTxtSizeDown;
		stage.addChild(txtSizeDown);
	}
	Ticker.addListener(window);
}

var currentTxt;
var offsetTxt = new Point();

function handleTxtPress(event) {
	console.log("handleTxtPress has been fired");
	var txt = event.target;
    currentTxt = txt;
    txt.shadow = new Shadow('#00FF00', 0, 0, 5);
    currentTxt.isMouseDown = true;
	txtDeleteButton.visible = true;
	txtSizeUp.visible = true;
	txtSizeDown.visible = true;
    update = true;
    txt.oldX = txt.x;
    txt.oldY = txt.y;
    event.onMouseMove = handleTxtMove;
}

function handleTxtMouseOver(event) {
	txt.shadow = null;
	txt = event.target;
	currentTxt = txt;
    txt.shadow = new Shadow('#00FF00', 0, 0, 5);
	txtDeleteButton.x = currentTxt.x - 30;
	txtDeleteButton.y = currentTxt.y - 55;
	txtSizeUp.x = currentTxt.x - 30;
	txtSizeUp.y = currentTxt.y - 30;
	txtSizeDown.x = currentTxt.x - 30;
	txtSizeDown.y = currentTxt.y - 5;
	txtDeleteButton.visible = true;
	txtSizeUp.visible = true;
	txtSizeDown.visible = true;
	update = true;
}

function handleTxtMove(event) {
	currentTxt.shadow = new Shadow('#00FF00', 0, 0, 5);
    currentTxt.x = event.stageX;
    currentTxt.y = event.stageY;
	txtDeleteButton.visible = true;
	txtSizeUp.visible = true;
	txtSizeDown.visible = true;
    currentTxt.x = event.stageX + (offset.x - 30);
    currentTxt.y = event.stageY + (offset.y - 30);
	txtDeleteButton.x = currentTxt.x - 30;
	txtDeleteButton.y = currentTxt.y - 55;
	txtSizeUp.x = currentTxt.x - 30;
	txtSizeUp.y = currentTxt.y - 30;
	txtSizeDown.x = currentTxt.x - 30;
	txtSizeDown.y = currentTxt.y - 5;
    update = true;
}

function handleTxtMouseOut(event) {
	Ticker.removeListener(checkTextForFocus);
	Ticker.addListener(checkTextForFocus);
	update = true;
}

function checkTextForFocus(event) {
	var currentMouseX = stage.mouseX;
	var currentMouseY = stage.mouseY;
	var positiveX = currentTxt.x + 150;
	var negativeX = currentTxt.x - 50;
	var positiveY = currentTxt.y + 150;
	var negativeY = currentTxt.y - 50;
	if (currentMouseX > positiveX || currentMouseX < negativeX || currentMouseY > positiveY || currentMouseY < negativeY || !stage.mouseInBounds) {
		currentTxt.shadow = null;
		txtDeleteButton.visible = false;
		txtSizeUp.visible = false;
		txtSizeDown.visible = false;
		update = true;
		Ticker.removeListener(checkTextForFocus);
	}
}

function handleTxtDelete(event) {
	var textToDelete = stage.getChildIndex(currentTxt);
	stage.removeChildAt(textToDelete);
	txtDeleteButton.visible = false;
	txtSizeUp.visible = false;
	txtSizeDown.visible = false;
	Ticker.removeListener(checkTextForFocus);
	update = true;
}

function handleTxtSizeUp(event) {
	if (currentTxt.scaleX <= 2.5) {
		currentTxt.scaleX = currentTxt.scaleX + .05;
		currentTxt.scaleY = currentTxt.scaleY + .05;
	} else {
		alert("Any larger and we won't be able to print the image..");
	}
	update = true;
}

function handleTxtSizeDown(event) {
	if (currentTxt.scaleX >= .05) {
		currentTxt.scaleX = currentTxt.scaleX - .05;
		currentTxt.scaleY = currentTxt.scaleY - .05;
	} else {
		alert("Any smaller and the image won't be visible.");
	}
	update = true;
}

function stop() {
	Ticker.removeListener(window);
}

function tick() {
	stage.update();
}

var saveForm = "hidden";

function getSaveDesign() {
	if (saveForm == "hidden") {
		$('#quote-form').css("visibility","hidden");
		quoteForm = "hidden";
		$("#save-form").css("visibility","visible");
		$('#save-form').html('Design Name: <input type="text" id="saveDesignName" />Email: <input type="text" id="saveEmail" /><a onclick="saveDesign(this)">Save Design</a>');
		$("#save-form").fadeIn(1200);
		saveForm = "";
	} else {         
		$("#save-form").css("visibility","hidden");
		saveForm = "hidden";
	}
}

function saveDesign() {
	var dataURL = stage.toDataURL();
	dataURL = dataURL.replace(/^data:image\/(png);base64,/, "");
	var designName = $("#saveDesignName").val();
	var email = $("#saveEmail").val();
	console.log("Email is " + email + " and Design Name is " + designName);
	$.ajax({
		type: 'POST',
		cache: false,
		url: 'save-image/',
		data: {"data": JSON.stringify(dataURL), "email": email, "design": designName, "text": frontText, "art": frontClipart},
		proccessData: false,
		timeout: 6000,
		error: function(XMLHttpRequest, errorTextStatus, error){
			alert("Failed to submit : " + errorTextStatus + " - " + error);
		},
		success: function(){
			$("#save-form").html("Your design has been saved.");
			$("#save-form").delay(500).fadeOut(1200);
			saveForm = "hidden";
		}	
	});
}

var quoteForm = "hidden";

function getQuoteForm() {
	if (quoteForm == "hidden") {
		$("#save-form").css("visibility","hidden");
		saveForm = "hidden";
		$('#quote-form').css("visibility","visible");
		$('#quote-form').fadeIn(1200);
		quoteForm = "";
	} else {         
		$('#quote-form').css("visibility","hidden");
		quoteForm = "hidden";
	}
}

function getPriceQuote(elem) {
	var quantity = $(elem).val();
	var colorArray = [];
	for (var k in namedItems) {
			colorArray.push(namedItems[k].color);
			update = true;
	}
	colorArray = removeDuplicates(colorArray);
	var frontPrintColors = colorArray.length;
	$.ajax({
		dataType: "json",
		type: 'POST',
		cache: false,
		url: 'price/',
		data: {"colors": frontPrintColors, "quantity": quantity, "id": currentProductID},
		proccessData: false,
		timeout: 8000,
		error: function(XMLHttpRequest, errorTextStatus, error){
			alert("Failed to submit : " + errorTextStatus + " - " + error);
		},
		success: function(data){
			console.log(data);     
		}
	});
}

function removeDuplicates(inputArray) {
    var i;
    var len = inputArray.length;
    var outputArray = [];
    var temp = {};

    for (i = 0; i < len; i++) {
        temp[inputArray[i]] = 0;
    }
    for (i in temp) {
        outputArray.push(i);
    }
    return outputArray;
}