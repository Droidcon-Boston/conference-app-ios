//
//  SocialController.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 3/16/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit
import Alamofire

enum SerializationError: Error {
    case missing(String)
    case invalid(String, Any)
}

struct Tweet {
    
    var date: Date
    var handle: String
    var id: Int32
    var text: String
    var userImage: String
    var userName: String
    
    init?(json: [String: Any]) throws {
        
        guard let id = json["id"] as? Int32 else {
            throw SerializationError.missing("id")
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
        
        guard let userImage = user["profile_image_url"] as? String else {
            throw SerializationError.missing("profile_image_url")
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

class SocialController: UITableViewController {
    
    var tweets: [Tweet] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 140
        
        requestTwitterToken { (accessToken) in
            guard let accessToken = accessToken else {
                return;
            }
            
            print("access token \(accessToken)")
            self.requestTwitterSearch(accessToken: accessToken, callback: { (results) in
                if let results = results {
                    // success
                    // populate tweets and reload table
                    print("got our tweets")
                    self.tweets = results
                    self.tableView!.reloadData()
                } else {
                    // show error message
                }
            })
        }
    }
    
    func requestTwitterSearch(accessToken: String, callback:@escaping (([Tweet]?) -> Void)) {
        
        let query = "%23DroidconBos"
        let twitterQueryUrl = "https://api.twitter.com/1.1/search/tweets.json?q=\(query)"
        let headers = ["Authorization": "Bearer \(accessToken)"]
        Alamofire.request(twitterQueryUrl, method: .get, headers: headers).responseJSON { response in
//            print(response.request as Any)  // original URL request
//            print(response.response as Any) // URL response
//            print(response.result.value as Any)   // result of response serialization
            
            guard let responseDict = response.result.value as? [String: Any] else {
                // error
                callback(nil)
                return
            }
            
            guard let statuses = responseDict["statuses"] as? [Any] else {
                // no results found
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
    
    func requestTwitterToken(callback:@escaping ((String?) -> Void)) {
        
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
                print(response.request as Any)  // original URL request
                print(response.response as Any) // URL response
                print(response.result.value as Any)   // result of response serialization
                if let responseDict = response.result.value as? NSDictionary,
                    let accessToken = responseDict["access_token"] as? String {
                    print(accessToken)
                    callback(accessToken)
                } else {
                    callback(nil)
                }
        }
        
    }
    
    func getTwitterAuthToken() -> String? {
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

    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        print(tweets.count)
        return tweets.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "TweetCell", for: indexPath) as! TweetCell
        
        let tweetObject = tweets[indexPath.row]
        cell.textContent?.text = tweetObject.text
        cell.handle?.text = "@\(tweetObject.handle)"
        cell.userName?.text = tweetObject.userName
        
        return cell
    }
}


