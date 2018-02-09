//
//  FAQAPI.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 4/3/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import Foundation
import Alamofire

struct FAQItem {
    
    var question: String
    var answer: String
    var photoUrl: String?
    var mapUrl: String?
    var otherUrl: String?
    
    init?(json: [String: Any]) throws {
        
        guard let question = FAQItem.getDataFromKey(key: "gsx$question", json: json) else {
            throw SerializationError.missing("gsx$question")
        }
        
        guard let answer = FAQItem.getDataFromKey(key: "gsx$answers", json: json) else {
            throw SerializationError.missing("gsx$answers")
        }
        
        let photoUrl = FAQItem.getDataFromKey(key: "gsx$photolink", json: json)
        let mapUrl = FAQItem.getDataFromKey(key: "gsx$maplink", json: json)
        let otherUrl = FAQItem.getDataFromKey(key: "gsx$otherlink", json: json)
        
        self.question = question
        self.answer = answer
        self.photoUrl = photoUrl
        self.mapUrl = mapUrl
        self.otherUrl = otherUrl
    }
    
    static func getDataFromKey(key: String, json: [String: Any]) -> String? {
        if let item = json[key] as? [String: Any] {
            // spreadsheet api embeds the value inside '$t' key
            if let value = item["$t"] as? String {
                if value.characters.count > 0 {
                    return value
                }
            }
        }
        return nil;
    }
    
}

struct FAQAPI {
    
    static func getSavedFileLocation() -> URL {
        let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let fileURL = documentsURL.appendingPathComponent("FAQData.json")
        return fileURL
    }
    
    static func getFAQ(callback:@escaping (([FAQItem]?) -> Void)) {
        
        var fileLocation: URL
        let fileExists = (try? getSavedFileLocation().checkResourceIsReachable()) ?? false
        if fileExists {
            fileLocation = getSavedFileLocation()
        } else {
            fileLocation = Bundle.main.url(forResource: "DefaultFAQ", withExtension: "json")!
        }
        
        FAQAPI.getFAQAtPath(path: fileLocation) { (results) in
            callback(results)
        }
    }
    
    static func downloadFAQ(callback:@escaping ((Bool) -> Void)) {
        let url = "https://spreadsheets.google.com/feeds/list/1Cx6aAfj4N9K8UPUPhVq-5vJ9XAQQhWyln3qh_K-dSZg/2/public/values?alt=json"
        
        let destination: DownloadRequest.DownloadFileDestination = { _, _ in
            return (getSavedFileLocation(), [.removePreviousFile, .createIntermediateDirectories])
        }
        
        Alamofire.download(url, to: destination).response { response in
            let success = (response.error == nil)
            callback(success)
        }
    }
    
    static func getFAQAtPath(path: URL, callback:@escaping (([FAQItem]?) -> Void)) {
        do {
            let jsonData = try Data(contentsOf: path)
            let json = try JSONSerialization.jsonObject(with: jsonData, options: []) as! [String: Any]
            
            FAQAPI.parseJson(json: json, callback: { (results) in
                
                callback(results)
            })
            return;
        } catch {
            print(error.localizedDescription)
            callback(nil)
        }
    }
    
    static func createTableData(items: [FAQItem]) -> (sections: [String], rows: [[FAQItem]]) {
        
        // group FAQ by common questions
        var sections: [String] = []
        var rows: [[FAQItem]] = []
        for item in items {
            let question = item.question
            if let index = sections.index(of: question) {
                // existing question
                rows[index].append(item)
            } else {
                // new question
                sections.append(question)
                rows.append([item])
            }
        }
        
        return (sections, rows)
    }
    
    static func parseJson(json: [String: Any], callback:@escaping (([FAQItem]?) -> Void)) {
        guard let feed = json["feed"] as? [String: Any] else {
            callback(nil)
            return
        }
        guard let entries = feed["entry"] as? [Any] else {
            callback(nil)
            return
        }
        
        
        do {
            var results: [FAQItem] = []
            
            for case let entryJson as [String: Any] in entries {
                if let entry = try FAQItem(json: entryJson) {
                    results.append(entry)
                }
            }
            
            callback(results)
        } catch {
            print(error.localizedDescription)
            callback(nil)
        }
    }
}
