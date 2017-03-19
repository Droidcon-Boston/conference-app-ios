//
//  TwitterAPI.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 3/19/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import Foundation
import Alamofire

enum SerializationError: Error {
    case missing(String)
    case invalid(String, Any)
}

struct Tweet {
    
    var date: Date
    var handle: String
    var id: String
    var text: String
    var userImage: String
    var userName: String
    
    init?(json: [String: Any]) throws {
        
        guard let id = json["id_str"] as? String else {
            throw SerializationError.missing("id_str")
        }
        
        guard let text = json["text"] as? String else {
            throw SerializationError.missing("text")
        }
        
        guard let dateString = json["created_at"] as? String else {
            throw SerializationError.missing("created_at")
        }
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "EEE MMM dd HH:mm:ss Z yyyy"
        guard let date = dateFormatter.date(from: dateString) else {
            throw SerializationError.invalid("created_at", dateString)
        }
        
        guard let user = json["user"] as? [String: Any] else {
            throw SerializationError.missing("user")
        }
        
        guard let userImage = user["profile_image_url_https"] as? String else {
            throw SerializationError.missing("profile_image_url_https")
        }
        
        guard let userName = user["name"] as? String else {
            throw SerializationError.missing("name")
        }
        
        guard let handle = user["screen_name"] as? String else {
            throw SerializationError.missing("screen_name")
        }
        
        self.date = date
        self.id = id
        self.text = text
        self.handle = handle
        self.userName = userName
        self.userImage = userImage
        
    }
}

struct TwitterAPI {
    
    static let kToken = "kDroidconBostonTwitterToken"
    
    static func getTweets(callback:@escaping (([Tweet]?) -> Void)) {
        
        TwitterAPI.requestTwitterToken { (accessToken) in
            guard let accessToken = accessToken else {
                callback(nil)
                return;
            }
            
            TwitterAPI.requestTwitterSearch(accessToken: accessToken, callback: { (results) in
                if let results = results {
                    // success
                    callback(results)
                } else {
                    // show error message
                    callback(nil)
                }
            })
        }
    }
    
    static func requestTwitterSearch(accessToken: String, callback:@escaping (([Tweet]?) -> Void)) {
        
        let query = "%23droidconbos-filter:retweets&src=typd&result_type=recent"
        let twitterQueryUrl = "https://api.twitter.com/1.1/search/tweets.json?q=\(query)"
        let headers = ["Authorization": "Bearer \(accessToken)"]
        Alamofire.request(twitterQueryUrl, method: .get, headers: headers).responseJSON { response in
            
            guard let responseDict = response.result.value as? [String: Any] else {
                // error, possibly network connection
                callback(nil)
                return
            }
            
            guard let statuses = responseDict["statuses"] as? [Any] else {
                // something went wrong, possible authentication issue
                
                // clear token from UserDefaults
                UserDefaults.standard.removeObject(forKey: kToken)
                UserDefaults.standard.synchronize()
                
                callback(nil)
                return
            }
            
            do {
                var results: [Tweet] = []
                
                for case let statusDict as [String: Any] in statuses {
                    if let status = try Tweet(json: statusDict) {
                        results.append(status)
                    }
                }
                
                callback(results)
            } catch {
                callback(nil)
            }
        }
    }
    
    static func requestTwitterToken(callback:@escaping ((String?) -> Void)) {
        
        if let storedToken = UserDefaults.standard.value(forKey: kToken) as? String {
            print("got stored token, proceeding..")
            print(storedToken)
            callback(storedToken)
            return
        } else {
            // Have to login
            print("No stored token found, need to authenticate first")
            guard let token = getTwitterAuthToken() else {
                callback(nil)
                return;
            }
            
            let twitterAuthUrl = "https://api.twitter.com/oauth2/token"
            let param = ["grant_type": "client_credentials"]
            let headers = [
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic \(token)"
            ]
            
            Alamofire.request(twitterAuthUrl, method: .post, parameters: param, headers: headers)
                .responseJSON { response in
                    
                    guard let responseDict = response.result.value as? [String: Any] else {
                        // error, possibly network connection
                        callback(nil)
                        return
                    }
                    
                    guard let accessToken = responseDict["access_token"] as? String else {
                        // something went wrong, possible authentication issue
                        callback(nil)
                        return
                    }
                    
                    // store token in UserDefaults
                    UserDefaults.standard.set(accessToken, forKey: kToken)
                    UserDefaults.standard.synchronize()
                    
                    callback(accessToken)
            }
        }
    }
    
    static func getTwitterAuthToken() -> String? {
        // using application-only authentication for twitter
        // https://dev.twitter.com/oauth/application-only
        // lists steps to retrieve token, necessary before searching tweets
        
        // get twitterKey and twitterSecret from keys.plist
        guard let keysPath = Bundle.main.path(forResource: "keys", ofType: "plist"),
            let keysDict = NSDictionary(contentsOfFile: keysPath) as? [String: String],
            let twitterKey = keysDict["twitterKey"],
            let twitterSecret = keysDict["twitterSecret"] else {
                print("keys.plist with twitterSecret and twitterKey items not found")
                return nil
        }
        
        // urlencode keys
        let encodedKey = twitterKey.addingPercentEncoding( withAllowedCharacters: NSCharacterSet.urlQueryAllowed)
        let encodedSecret = twitterSecret.addingPercentEncoding( withAllowedCharacters: NSCharacterSet.urlQueryAllowed)
        // concat with : delimiter
        let combinedKeys = encodedKey! + ":" + encodedSecret!
        print(combinedKeys)
        // convert to base64
        let base64 = combinedKeys.data(using: .utf8)
        let tokenString = base64?.base64EncodedString()
        return tokenString
    }

}
