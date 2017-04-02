//
//  AgendaAPI.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 3/23/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import Foundation
import Alamofire

struct Event {
    
    var name: String
    var talk: String
    var description: String
    var room: String
    var photoUrl: String
    var bio: String
    var date: Date?
    var twitter: String
    var linkedIn: String
    var facebook: String
    
    init?(json: [String: Any]) throws {
        
        guard let bio = Event.getDataFromKey(key: "gsx$bio", json: json) as? String else {
            throw SerializationError.missing("gsx$bio")
        }
        guard let dateString = Event.getDataFromKey(key: "gsx$date", json: json) as? String else {
            throw SerializationError.missing("gsx$date")
        }
        guard let description = Event.getDataFromKey(key: "gsx$description", json: json) as? String else {
            throw SerializationError.missing("gsx$description")
        }
        guard let facebook = Event.getDataFromKey(key: "gsx$facebook", json: json) as? String else {
            throw SerializationError.missing("gsx$facebook")
        }
        guard let linkedIn = Event.getDataFromKey(key: "gsx$linkedin", json: json) as? String else {
            throw SerializationError.missing("gsx$linkedin")
        }
        guard let name = Event.getDataFromKey(key: "gsx$name", json: json) as? String else {
            throw SerializationError.missing("gsx$name")
        }
        guard let photoUrl = Event.getDataFromKey(key: "gsx$photolink", json: json) as? String else {
            throw SerializationError.missing("gsx$photolink")
        }
        guard let room = Event.getDataFromKey(key: "gsx$room", json: json) as? String else {
            throw SerializationError.missing("gsx$room")
        }
        guard let talk = Event.getDataFromKey(key: "gsx$talk", json: json) as? String else {
            throw SerializationError.missing("gsx$talk")
        }
        guard let timeString = Event.getDataFromKey(key: "gsx$time", json: json) as? String else {
            throw SerializationError.missing("gsx$time")
        }
        guard let twitter = Event.getDataFromKey(key: "gsx$twitter", json: json) as? String else {
            throw SerializationError.missing("gsx$twitter")
        }
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "M/d/yyyy h:mm a"
        let date = dateFormatter.date(from: "\(dateString) \(timeString)")
        
        self.bio = bio
        self.date = date
        self.description = description
        self.facebook = facebook
        self.linkedIn = linkedIn
        self.name = name
        self.photoUrl = photoUrl
        self.room = room
        self.talk = talk
        self.twitter = twitter
    }
    
    static func getDataFromKey(key: String, json: [String: Any]) -> Any? {
        if let item = json[key] as? [String: Any] {
            // spreadsheet api embeds the value inside '$t' key
            if let value = item["$t"] {
                return value
            }
        }
        return nil;
    }

}

struct AgendaAPI {
    
    static func getAgendaRemote(callback:@escaping (([Event]?) -> Void)) {
        
        let key = "1Cx6aAfj4N9K8UPUPhVq-5vJ9XAQQhWyln3qh_K-dSZg"
        let url = "https://spreadsheets.google.com/feeds/list/\(key)/od6/public/values?alt=json"
        
        Alamofire.request(url, method: .get).responseJSON { response in
            guard let json = response.result.value as? [String: Any] else {
                // error, possibly network connection
                callback(nil)
                return
            }
            
            AgendaAPI.parseJson(json: json, callback: { (results) in
                callback(results)
            })
        }
    }
    
    static func getAgendaLocal(callback:@escaping (([Event]?) -> Void)) {
        do {
            if let file = Bundle.main.url(forResource: "DefaultData", withExtension: "json") {
                
                let jsonData = try Data(contentsOf: file)
                let json = try JSONSerialization.jsonObject(with: jsonData, options: []) as! [String: Any]
                
                AgendaAPI.parseJson(json: json, callback: { (results) in
                                        
                    callback(results)
                })
                return;
            }
        } catch {
            print(error.localizedDescription)
            callback(nil)
        }
    }
    
    static func createTableData(events: [Event], day: Date) -> (sections: [Date], rows: [[Event]]) {
        
        let timeFormatter = DateFormatter()
        timeFormatter.dateFormat = "h:mm a"
        
        var data: [Date: [Event]] = [:]
        for item in events {
            
            // only get event from specified day
            if let date = item.date {
                if Calendar.current.isDate(day, inSameDayAs: date) {
                    
                    if let existingEvents = data[date] {
                        
                        // sort items in same timeblock by room
                        let newEvents = existingEvents + [item]
                        data[date] = newEvents.sorted(by: { a, b -> Bool in
                            a.room < b.room
                        })
                        
                    } else {
                        data[date] = [item]
                    }
                }
            }
        }
        
        let sortedKeys = Array(data.keys).sorted { a, b -> Bool in
            a < b
        }
        var rows: [[Event]] = []
        for key in sortedKeys {
            rows.append(data[key]!)
        }
        
        return (sortedKeys, rows)
    }
    
    static func parseJson(json: [String: Any], callback:@escaping (([Event]?) -> Void)) {
        guard let feed = json["feed"] as? [String: Any] else {
            callback(nil)
            return
        }
        guard let entries = feed["entry"] as? [Any] else {
            callback(nil)
            return
        }
        
        
        do {
            var results: [Event] = []
            
            for case let entryJson as [String: Any] in entries {
                if let entry = try Event(json: entryJson) {
                    results.append(entry)
                }
            }
            
            callback(results)
        } catch {
            callback(nil)
        }
    }
}
