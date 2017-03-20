//
//  SocialController.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 3/16/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit
import AlamofireImage

class SocialController: UITableViewController {
    
    var tweets: [Tweet] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 140
        tableView.separatorColor = UIColor.themeGreenAccent
        
        self.refreshControl = UIRefreshControl()
        self.refreshControl?.addTarget(self, action: #selector(getData), for: .valueChanged)
        
        getData()
    }
    
    func getData() {
        
        self.tableView.tableFooterView = nil
        
        if (self.tweets.count == 0) {
            self.refreshControl?.beginRefreshing()
            self.tableView.setContentOffset(CGPoint(x: 0, y: -self.refreshControl!.frame.size.height), animated: true)
            self.view.layoutIfNeeded()
        }
        
        TwitterAPI.getTweets { (results) in
            if let results = results {
                // populate tweets and reload table
                self.tweets = results
                self.tableView!.reloadData()
            } else {
                // show error message
                if (self.tweets.count == 0) {
                    self.tableView.tableFooterView = self.createErrorView()
                }
            }
            
            self.refreshControl?.endRefreshing()
        }
    }
    
    func createErrorView() -> UIView {
        let errorView = UIView(frame: CGRect(x: 0, y: 0, width: self.tableView.bounds.size.width, height: self.tableView.bounds.size.height))
        let errorRetryButton = UIButton(frame: CGRect(x: 0, y: 0, width: self.tableView.bounds.size.width, height: 50))
        errorRetryButton.setTitle("Error. Retry?", for: .normal)
        errorRetryButton.setTitleColor(UIColor.blue, for: .normal)
        errorRetryButton.setTitleColor(UIColor.blue.withAlphaComponent(0.5), for: .highlighted)
        errorRetryButton.addTarget(self, action: #selector(self.getData), for: .touchUpInside)
        errorView.addSubview(errorRetryButton)
        return errorView
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
        cell.textContent?.textColor = UIColor.themeBlueMain
        cell.userName?.textColor = UIColor.themeBlueMain
        cell.handle?.textColor = UIColor.themeGreenAccent
        cell.userImage.layer.cornerRadius = 20
        cell.selectionStyle = .none
        
        let tweetObject = tweets[indexPath.row]
        cell.textContent?.text = tweetObject.text
        cell.handle?.text = "@\(tweetObject.handle)"
        cell.userName?.text = tweetObject.userName
        
        let imageUrl = URL(string: tweetObject.userImage)!
        cell.userImage?.af_setImage(withURL: imageUrl)
        
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let tweetObject = tweets[indexPath.row]
        if let tweetUrl = URL(string: "https://twitter.com/user/status/\(tweetObject.id)") {
            UIApplication.shared.open(tweetUrl, options: [:], completionHandler: nil)
        }
    }
}


