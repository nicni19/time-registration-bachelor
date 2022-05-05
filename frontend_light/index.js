
async function clearList(){
    var tableHeaderRowCount = 1;
    var table = document.getElementById('resultTable');
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }
}

function newTest(){

    var myJSON = {"elements":[
        {
            id: 6,
            userID: '6fc4dcd488b119e7',
            type: undefined,
            customer: null,
            description: 'This is the descrsiption of the element',
            startTimestamp: '1648797418621',
            duration: '22',
            internalTask: true,
            unpaid: true,
            edited: false,
            bookKeepReady: false,
            ritNum: null,
            caseNum: null,
            caseTaskNum: null,
            calendarid: null,
            mailid: null
          }
    ]};
    let table = document.getElementById('resultTable');

    myJSON.elements.forEach(element =>{
        let newRow = table.insertRow();
        for(var key in element){
            let newCell = newRow.insertCell();
            newCell.append(element[key])
        }
    });

}

async function getLogElements(){
    clearList();

    token = 'EwBwA8l6BAAUwihrrCrmQ4wuIJX5mbj7rQla6TUAAVfej3Or6u/Fvqi5S5XejmJhrm9ih1ia7FS+9hvvYu6kFpGLfxGkpNyQxpLX5iivkR0+1KeUoVj1qDeR/PvwvRPQHL4Xn6G8oJl2UDMWNFMbDY9MGIlQNSwKu9KSnhNYwu9mFT9nsOm5fpA/to35peBtSRyTBRp7ftFPi1yVWAfh/QmCO5AJ96jw3XSQWsT/F0DA50h8dRYgzFU10EAJMFCy1iS28vP1sSUuF9BX7zF1EyPueykA2/NkACgKuLe9MD+Anm7DP5mfHQJ1covW2Bm8FqCY4ZendHA5XYC5jhd0fNdKXzCXeMWNwginRpl5BhRKMOquUy2GDF8+1V/5ViYDZgAACFgoILbQsOqPQAJQvzybRkur9CrYHuMg0xyGRF7GY8xXlv6CqkLgcX8ilV61DJSilO98wSOYBX2VvoGFAfs1cshyVlYc5B2KX0jgKC9GpYebmYg/2OO7g70cagd2UkIxkTdeueLMWWqEAyoPxbCwLbBz2s5WP5FaXXXt0g7YX6fa6X4lkUQtTwx9a29RhVHFdTNuqT684JznBy9EoSB+aJkQeI6sWsVsMriQMvpZuruD0AfBDXon/Llt2czU61/AoyhiwbC9S2YxLp+CpdRs+/n9Ibn0PruNp3ZsKzrHaJP3/bCDJGm7YwEaWDXAhMNhDxA6r1Vw0UuzXwwML06pQqAMrfGErObg9moQ4GLjdg4oY7ngJpm2MFbkXZ574Y1ZNQYc4n4rRiu5Eh6I2KLP+hlndJAQ9QEMGHX/pL34XU1mIalqEvSzeB0j5Alcplskzc+aq/CApuCluHPPNXI5VL5SMOVjZm9M+joXHdqjMYOlRDLER/6KYJbaYLHU2tITUFTJGs7HW+5GZ8EH6gFBdBd79AUryT/32uv945rj8xIOpuQbvi5ieNksa9Hf9sFuBq0eJyUuCcr3hyYtjRcSbRLciTMS3oKyeIfzo+Kegwz9nQVWK4hUrDru+UMQhtaH62Yb4an/7mxSGNSQOAeU0ThPHDGJHmCJQMiRW8adiwatg6nudibsvQF+2HQg1JgKGPIRiRaLSacjJvrjTCyvgpxmp5QZmFda23BiFCsoKQRHZ9XW8sy0K0aQf5wCXftf7rltUviRc4zZo5N+Ag=='
    user = '615498f0dae8d115'
    
    //console.log(document.getElementById('graphToken').value)
    //console.log(document.getElementById('userID').value)

    /*
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer EwBwA8l6BAAUwihrrCrmQ4wuIJX5mbj7rQla6TUAARDkeL09wKr6b9a2xiD2TK+HFIfM+kOSvZLEFcpRFEjUGsfnTatTyxzUhzEvp/haeeSEmGR00sdve/v/Or9bJ9qNzz3ZT0r7BhCzEQZpZHoAi6M3oNrBbtw849kUuUiuyID8Kmjb2/CUyCBuhfZeCID5i++TUDYHt5eZgpq2lGZsVKY7zy3T8EgkF7eMgsJ4ZPeSbFClN+FhyOnZFHFEcdz+9ezBiodnj8JBJ2FcDF0rQSJQ0oaEyqbBkRZKIO4YUszPPVu+XD+P5runSL9p2PrNBV1JjeuoNVSfQA1K9OTEGvx+e9tpAMW1PptYSAAImoIzOWuPgg3/xo1fm5hZtIQDZgAACMYS7BV6K9wqQALihHYCkz35rb50+6wqx5Z5oTYMTuOtQGt49HiRNLUEoFTX83dm0thgZOzxw+hpPAHUT1N5rtkEt6/qYkT6tuyhKvZTCsaEEwtINCgbS5I0hMaOVkGbO2QIWkstWYYXkyIElDJVLjgIsJ5d0Gec2tqDw0c0A8+6hPuo7HXTW7hCLanVt9wzMXpx8XE0v1F6xS9ZZ+EoQwTVMW8sZjpIdz+fMtq4BbLGh2sl0RlAA6Vl6NxwsnVxbBe8WMaPPb6V01pFsw0f/Y8qalJ2WaNWJTpUVESbh+Io+pYbG1UPGs7lWnU0ooMkzxNnBPK7rRRqRYJxpSCbNsX0b19WCdU6JTOxHH6Xyz5XrKR7aKdFdaBLJtQmR1oSNT0GiRulIFcalTxCNH1N1c+3tcvodZeOvGItX6BQs4Hl8kYmHNl53H5gosdrn/dHRKlhkMe8tI8613rONHA1KUxm0n8lnoqtvnlAhidEkLDSnBV367PcPETvavuXe7fDXPro1XZEpQVeNErogDKvRg2xzzFDi4Lg/UOdwXw46KgtkttB/G7lFNMq61lOxWXFmm1h02UBvEE36zp+wllG/DzyTG4wMdPkZMlLptjj/APO/ZEyhHS/8WhsKVOtoOJlcRErQ3NtGV9uGoIA8n7RdOxyC10tcZtbZT7Py239VsrQmJRU4CBxEjTT0y+p40NIqJ6czY7QL/QU/oaV5cNT5XhihAeywaGMn98flRUOY4M/LcvCVWSN1rI3ZUEofqP5eVINN9o5Akp3Bwl+Ag==',
            'userid' : user
        },
        mode: 'no-cors'
      };
    */
    responseJson = {};
    return await fetch('http://localhost:3000/GetLogElements',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(document.getElementById('graphToken').value),
            'userid' : String(document.getElementById('userID').value)
        },
        //body: JSON.stringify(data),
        mode: 'cors'
    }).then(response => response.json()).then(data=>{responseJson = data;}).then(()=>{
        let table = document.getElementById('resultTable');

        for(let i = 0; i < responseJson.length; i++){
            let newRow = table.insertRow();
            for(var key in responseJson[i]){
                let newCell = newRow.insertCell();
                newCell.append(responseJson[i][key])
            }
        }
    }).catch((err)=>{
        console.log(err); 
        //window.alert(err);
    });
    
}