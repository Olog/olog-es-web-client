/**
 * Copyright (C) 2020 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import {formatShortDate, getSearchString, sortSearchResult, removeImageMarkup, getLogEntryGroup, hasOnlyLogEntryGroupProperty} from './utils';
import moment from 'moment';

test('getSearchString owner', () => {
    let searchCriteria = {owner: "owner"};
    expect(getSearchString(searchCriteria)).toContain('owner=owner');
});

test('getSearchString title', () => {
    let searchCriteria = {title: "title"};
    expect(getSearchString(searchCriteria)).toContain('title=title');
});

test('getSearchString text', () => {
    let searchCriteria = {text: "text"};
    expect(getSearchString(searchCriteria)).toContain('desc=text');
});

test('getSearchString level', () => {
    let searchCriteria = {level: "level"};
    expect(getSearchString(searchCriteria)).toContain('level=level');
    
});

test('getSearchString logbooks', () => {
    let searchCriteria = {logbooks: ["logbook1", "logbook2"]};
    expect(getSearchString(searchCriteria)).toContain('logbooks=logbook1,logbook2');
});

test('getSearchString tags', () => {
    let searchCriteria = {tags: ["tag1", "tag2"]};
    expect(getSearchString(searchCriteria)).toContain('tags=tag1,tag2');
});

test('getSearchString default time tange', () => {
    let searchCriteria = {};
    expect(getSearchString(searchCriteria)).toContain('start=');
    expect(getSearchString(searchCriteria)).toContain('end=');
});

test('getSearchString time tange', () => {
    let searchCriteria = {startDate: '1 hour', endDate: 'now'};
    expect(getSearchString(searchCriteria)).toContain('start=1 hour&end=now');
});

test('sortSearchResult', () => {
    let searchResult = [];

    let date1 = moment().toDate();
    searchResult.push({createdDate: date1});
    searchResult.push({createdDate: date1});

    let date2 = moment().subtract(2, 'days').toDate();
    searchResult.push({createdDate: date2});
    searchResult.push({createdDate: date2});
    searchResult.push({createdDate: date2});

    let date3 = moment().subtract(2, 'weeks').toDate();
    searchResult.push({createdDate: date3});

    let result = sortSearchResult(searchResult);
    expect(result).toBeDefined();
    expect(result[formatShortDate(date1)].length).toBe(2);
    expect(result[formatShortDate(date2)].length).toBe(3);
    expect(result[formatShortDate(date3)].length).toBe(1);
});

test('sortSearchResultUnsortedResult', () => {
    let searchResult = [];

    let date1 = moment().subtract(2, 'weeks').toDate();
    searchResult.push({createdDate: date1});
    searchResult.push({createdDate: date1});

    let date2 = moment().toDate();
    searchResult.push({createdDate: date2});
    searchResult.push({createdDate: date2});
    searchResult.push({createdDate: date2});

    let date3 = moment().subtract(2, 'days').toDate();
    searchResult.push({createdDate: date3});

    let result = sortSearchResult(searchResult);
    expect(result).toBeDefined();
    let previousDate = null;
    // Check that result array is sorted on date (descending).
    Object.entries(result).forEach(([key, value]) => {
        if(!previousDate){
            previousDate = moment(key, 'YYYY-MM-DD');
            return;
        }
        let nextDate = moment(key, 'YYYY-MM-DD');
        expect(nextDate.isBefore(previousDate)).toBeTruthy();
        previousDate = nextDate;
    });
});

test('sortSearchNoResult', () => {
    let searchResult = [];
    let result = sortSearchResult(searchResult);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);

    result = sortSearchResult(null);
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
});

test('removeImageMarkupNoOtherContent', () => {
    let markup = "![](attachment/123456789){width=100 height=100}";
    let result = removeImageMarkup(markup, "123456789");
    expect(result).toBe("");
});

test('removeImageMarkupWithOtherContent', () => {
    let markup = "ABC ![](attachment/123456789){width=100 height=100} DEF";
    let result = removeImageMarkup(markup, "123456789");
    expect(result).toBe("ABC  DEF");
});

test('removeImageMarkupMultipleEmbeddedImages', () => {
    let markup = "![](attachment/ABCDE){width=100 height=100}\n![](attachment/123456789){width=100 height=100}\n![](attachment/abcde){width=100 height=100}";
    let result = removeImageMarkup(markup, "123456789");
    expect(result).toBe("![](attachment/ABCDE){width=100 height=100}\n\n![](attachment/abcde){width=100 height=100}");
});

test('removeImageMarkupNonMatchingImageMarkup', () => {
    let markup = "![](attachment/123456789){width=100 height=100}";
    let result = removeImageMarkup(markup, "abcde");
    expect(result).toBe("![](attachment/123456789){width=100 height=100}");
});

test('removeImageMarkupNoImageMarkup', () => {
    let markup = "whatever";
    let result = removeImageMarkup(markup, "123456789");
    expect(result).toBe("whatever");
});

test('getLogEntryGroup', () => {
    let logEntry = {
        properties: [
            {"name" : "Log Entry Group", "attributes" : [{"name" : "id", "value" : "myLogEntryGroupId"}]}
        ]
    }
    let result = getLogEntryGroup(logEntry.properties);
    expect(result).toBe("myLogEntryGroupId");
});

test('getLogEntryGroupMissing', () => {
    let logEntry = {
        properties: [
            {"name" : "Not Log Entry Group", "attributes" : [{"name" : "id", "value" : "myLogEntryGroupId"}]}
        ]
    }
    let result = getLogEntryGroup(logEntry.properties);
    expect(result).toBeNull();

    logEntry = {
        properties: [
            {"name" : "Log Entry Group"}
        ]
    }
    result = getLogEntryGroup(logEntry.properties);
    expect(result).toBeNull();

    logEntry = {
        properties: [
            {"name" : "Log Entry Group", "attributes" : []}
        ]
    }
    result = getLogEntryGroup(logEntry.properties);
    expect(result).toBeNull();

    logEntry = {
        properties: [
            {"name" : "Log Entry Group", "attributes" : [{"name" : "not id", "value" : "myLogEntryGroupId"}]}
        ]
    }
    result = getLogEntryGroup(logEntry.properties);
    expect(result).toBeNull();
});

test('hasOnlyLogEntryGroupProperty', () => {
    
    let result = hasOnlyLogEntryGroupProperty(null);
    expect(result).toBeFalsy(); 

    result = hasOnlyLogEntryGroupProperty([]);
    expect(result).toBeFalsy(); 

    let properties = [
        {"name" : "Log Entry Group", "attributes" : [{"name" : "id", "value" : "myLogEntryGroupId"}]}
    ]

    result = hasOnlyLogEntryGroupProperty(properties);
    expect(result).toBeTruthy(); 

    properties = [
        {"name" : "Log Entry Group", "attributes" : [{"name" : "id", "value" : "myLogEntryGroupId"}]},
        {"name" : "foo", "attributes" : [{"name" : "id", "value" : "myLogEntryGroupId"}]}
    ]

    result = hasOnlyLogEntryGroupProperty(properties);
    expect(result).toBeFalsy();

    properties = [
        {"name" : "foo", "attributes" : [{"name" : "id", "value" : "myLogEntryGroupId"}]}
    ]

    result = hasOnlyLogEntryGroupProperty(properties);
    expect(result).toBeFalsy();
});