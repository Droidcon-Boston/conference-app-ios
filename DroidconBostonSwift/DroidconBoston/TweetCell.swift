//
//  TweetCell.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 3/18/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit

class TweetCell: UITableViewCell {
    
    @IBOutlet weak var userImage: UIImageView!
    @IBOutlet weak var userName: UILabel!
    @IBOutlet weak var handle: UILabel!
    @IBOutlet weak var textContent: UILabel!
    
    override func awakeFromNib() {
        self.textContent?.textColor = UIColor.themeBlueMain
        self.userName?.textColor = UIColor.themeBlueMain
        self.handle?.textColor = UIColor.themeGreenAccent
        self.userImage.layer.cornerRadius = 20
    }
    
}
