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
    var time: String
    var date: String
    var twitter: String
    var linkedIn: String
    var facebook: String
    
    init?(json: [String: Any]) throws {
        
        guard let bio = Event.getDataFromKey(key: "gsx$bio", json: json) as? String else {
            throw SerializationError.missing("gsx$bio")
        }
        guard let date = Event.getDataFromKey(key: "gsx$date", json: json) as? String else {
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
        guard let time = Event.getDataFromKey(key: "gsx$time", json: json) as? String else {
            throw SerializationError.missing("gsx$time")
        }
        guard let twitter = Event.getDataFromKey(key: "gsx$twitter", json: json) as? String else {
            throw SerializationError.missing("gsx$twitter")
        }
        
        self.bio = bio
        self.date = date
        self.description = description
        self.facebook = facebook
        self.linkedIn = linkedIn
        self.name = name
        self.photoUrl = photoUrl
        self.room = room
        self.talk = talk
        self.time = time
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
    
    static func getAgenda(callback:@escaping (([Event]?) -> Void)) {
        let url = "https://spreadsheets.google.com/feeds/list/1wF628dwex_AkUF1biuQ7s_lpaT-htDVbysGwMv78uFM/od6/public/values?alt=json"
        
        Alamofire.request(url, method: .get).responseJSON { response in
            guard let responseDict = response.result.value as? [String: Any] else {
                // error, possibly network connection
                callback(nil)
                return
            }
            guard let feed = responseDict["feed"] as? [String: Any] else {
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
}
