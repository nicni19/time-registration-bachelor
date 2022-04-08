

function listTest(){
    let testJson = {'elements':[{name:'Nicolaj',age:'25'}]};
    let node = document.createElement('li')
    node.append(testJson.elements[0])
    document.getElementById('resultsList').append(document.getElementById('testElement').cloneNode(true))
    
}

function clearList(){
    document.getElementById('resultsList').innerHTML="";
    document.getElementById('resultsWrapper').scrollTop = 0;
}

function newTest(){
    node = document.createElement('li')
    node.append('<div>hej</div>')
    document.getElementById('resultsList').append(node)
}

function testListFunc(){
    obj = {
        0: {
            "name": "Dabs",
            "hours":3
        },
        1: {
            "name": "CUbs",
            "hours":3
        }
    }
    
    obj.array.forEach(element => {
        /*
        document.getElementById("container").append(
            "<p class='logElement'>" + element.name + "</p>"
        )
        */
        //"<p class='logElement'>" + element.name + "</p>"
        let node = document.createElement('li')
        node.append("<p class='logElement'>" + element.name + "</p>")
        document.getElementById('resultsList').append(document.createElement('li').append("Hej!"))
        //"<div class='logElement' style={display:flex; justify-content: center; height: 30px; width: 95%; outline: 2px; outline-style: none; margin-bottom: 10px;}><div>" + element.name + "</div><div>" + element.hours + "</div></div>"
    });
}