import { Core } from '../src/common/core'
import { LogElement } from '../src/common/domain/LogElement';
import { JsonConverter } from '../src/common/JsonConverter';

let assert = require('assert');

describe('convertJSONToLogElements',function(){
  let jsonConvert = new JsonConverter();
  
  let testJson = [{
    id: 308,
    userID: '615498f0dae8d115',
    type: 0,
    customer: '',
    description: 'This is element 1',
    startTimestamp: 1652443200000,
    duration: 3600000,
    internalTask: true,
    unpaid: true,
    edited: true,
    bookKeepReady: false,
    ritNum: 0,
    caseNum: '',
    caseTaskNum: 0,
    calendarid: '',
    mailid: ''
  },{
    id: 309,
    userID: '615498f0dae8d115',
    type: 0,
    customer: 'Jondog',
    description: 'This is element 2',
    startTimestamp: 1652446800000,
    duration: 5400000,
    internalTask: false,
    unpaid: false,
    edited: true,
    bookKeepReady: true,
    ritNum: 100,
    caseNum: 'RIT-100',
    caseTaskNum: 100,
    calendarid: '',
    mailid: ''
  },{
    userID: '615498f0dae8d115',
    type: 0,
    customer: '',
    description: 'New empty element',
    startTimestamp: 1652446725237,
    duration: 0,
    internalTask: false,
    unpaid: false,
    edited: true,
    bookKeepReady: false,
    ritNum: 0,
    caseNum: '',
    caseTaskNum: 0,
    calendarid: '',
    mailid: ''
  }];

  let resultMap:Map<string,LogElement[]> = jsonConvert.convertJSONToLogElements(testJson);

  it('All old elements should have IDs',function(){
    resultMap.get('Old').map(element=>{
      assert(element.getId() != undefined || null)
    })
  })

  it('All new elements should not have IDs',function(){
    resultMap.get('New').map(element=>{
      assert(element.getId() == undefined || null)
    })
  })

})

