

function listTest(){
    let testJson = {'elements':[{name:'Nicolaj',age:'25'}]};
    let node = document.createElement('li')
    node.append(testJson.elements[0])
    document.getElementById('resultsList').append(document.getElementById('testElement').cloneNode(true))
    
}

function clearList(){
    let ul = document.getElementById('resultsList').innerHTML="";
    document.getElementById('resultsWrapper').scrollTop = 0;
}