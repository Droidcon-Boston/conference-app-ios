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
    
    var name: String?
    var talk: String?
    var description: String?
    var room: String?
    var photoUrl: String?
    var bio: String?
    var date: Date?
    var twitter: String?
    var linkedIn: String?
    var facebook: String?
    
    init?(json: [String: Any]) throws {
        
        let bio = Event.getDataFromKey(key: "gsx$bio", json: json)
        let dateString = Event.getDataFromKey(key: "gsx$date", json: json)
        let description = Event.getDataFromKey(key: "gsx$description", json: json)
        let facebook = Event.getDataFromKey(key: "gsx$facebook", json: json)
        let linkedIn = Event.getDataFromKey(key: "gsx$linkedin", json: json)
        let name = Event.getDataFromKey(key: "gsx$name", json: json)
        let photoUrl = Event.getDataFromKey(key: "gsx$photolink", json: json)
        let room = Event.getDataFromKey(key: "gsx$room", json: json)
        let talk = Event.getDataFromKey(key: "gsx$talk", json: json)
        let timeString = Event.getDataFromKey(key: "gsx$time", json: json)
        let twitter = Event.getDataFromKey(key: "gsx$twitter", json: json)
        
        var date: Date?
        if let dateString = dateString, let timeString = timeString {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "M/d/yyyy h:mm a"
            date = dateFormatter.date(from: "\(dateString) \(timeString)")
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
        self.twitter = twitter
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

struct AgendaAPI {
    
    static func getSavedFileLocation() -> URL {
        let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let fileURL = documentsURL.appendingPathComponent("AgendaData.json")
        return fileURL
    }
    
    static func getAgenda(callback:@escaping (([Event]?) -> Void)) {
        
        var fileLocation: URL
        let fileExists = (try? getSavedFileLocation().checkResourceIsReachable()) ?? false
        if fileExists {
            fileLocation = getSavedFileLocation()
        } else {
            fileLocation = Bundle.main.url(forResource: "DefaultData", withExtension: "json")!
        }
        
        AgendaAPI.getAgendaAtPath(path: fileLocation) { (results) in
            callback(results)
        }
    }

    static func downloadAgenda(callback:@escaping ((Bool) -> Void)) {
        let url = "https://spreadsheets.google.com/feeds/list/1wF628dwex_AkUF1biuQ7s_lpaT-htDVbysGwMv78uFM/od6/public/values?alt=json"
        
        
        let destination: DownloadRequest.DownloadFileDestination = { _, _ in
            return (getSavedFileLocation(), [.removePreviousFile, .createIntermediateDirectories])
        }
        
        Alamofire.download(url, to: destination).response { response in
            let success = (response.error == nil)
            callback(success)
        }
    }

    static func getAgendaAtPath(path: URL, callback:@escaping (([Event]?) -> Void)) {
        do {
            let jsonData = try Data(contentsOf: path)
            let json = try JSONSerialization.jsonObject(with: jsonData, options: []) as! [String: Any]
            
            AgendaAPI.parseJson(json: json, callback: { (results) in
                
                callback(results)
            })
            return;
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
                            if let roomA = a.room, let roomB = b.room {
                                return roomA < roomB
                            } else {
                                return true
                            }
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
            print(error.localizedDescription)
            callback(nil)
        }
    }
}
