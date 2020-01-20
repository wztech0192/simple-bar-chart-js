
 /**
  * @author Wei Zheng
  * @description 2kb size lightweight library that present your data in a line chart. No crazy styling, only speed and data!
  * @param {HTMLElement | String} target 
  * @param {KeyValueObject} data 
  */
function SimpleLineChart(target, data){
    var _el = target instanceof Element ? target :  document.querySelector(target);

    if(!_el) return;

    function createStyleEl(tag, inner, styles){
        var temp_el = document.createElement(tag);
        temp_el.innerHTML = inner || "";
        if(styles){
            temp_el.setAttribute("style", styles)
        }
        return temp_el;
    }

    var keys = Object.keys(data);
    var width = _el.offsetWidth - 160;
    var height = _el.offsetHeight;
    var singleHeight = height/keys.length;
    var topDownMargin = 0;
    if(singleHeight > 150){
        topDownMargin = (singleHeight - 150) / 2;
        //max 150 height;
        singleHeight = 150;
    }else if(singleHeight < 30){
        //min 30 height;
        singleHeight = 30;
    }

    var maxWidth = 0;
    keys.forEach(function(key){
        if(data[key] > maxWidth){
            maxWidth = data[key]
        }
    })

    var diff = width/maxWidth;
    var container =  createStyleEl("div", "", "margin-right:30px; width:100%;height:100%;position:relative;");
    var chartHeader = createStyleEl("div", "", "position:absolute;height:100%;margin-left:100px;")
    chartHeader.appendChild(createStyleEl("div", "", ""));
    var xAxisNum = Math.floor(width / 80);
    var xStepper = Math.ceil(maxWidth / xAxisNum);
    var xAxisWidth, xAxisValue;
    for(var i=0; i<maxWidth + xStepper; i+= xStepper){
            if(i * diff <= width){
                xAxisWidth = i * diff;
                xAxisValue = Math.round(i).toString();
            }else{
                xAxisWidth = width;
                xAxisValue = maxWidth;
            }
            var xAxisWidth = (i * diff <= width? i * diff: width) ;
            var xAxis = createStyleEl("div", "<div style='transform:rotate(40deg);align-self:flex-end;margin-bottom:-25px;'>"+xAxisValue+"</div>", 
                "height:100%;border-left:1px solid gray;display:flex;position:absolute;left:"+xAxisWidth+"px;width:1px"
                );
            chartHeader.appendChild(xAxis);
    }

    var chartBody = createStyleEl("div", "", "height:100%;overflow:auto");
    keys.forEach(function(key){
         var singleWidth = data[key] * diff;
        //console.log(singleWidth)
        var row = createStyleEl("div", "", "display:flex;align-items:center;height:"+singleHeight
            +"px;margin-top:"+topDownMargin+"px;margin-bottom:"+topDownMargin+"px;");
        var keyLabel = createStyleEl("div", key, "display:inline-block;width:100px;");
        var chartBlock = createStyleEl("div", "", "display:inline-block;background:lightgray;height:60%;width:"+singleWidth+"px");
        chartBlock.setAttribute("title", key+": "+data[key])
        row.appendChild(keyLabel);
        row.appendChild(chartBlock);
        chartBody.appendChild(row);
    })

    container.appendChild(chartHeader);
    container.appendChild(chartBody);
    _el.innerHTML = "";
    _el.appendChild(container);
}