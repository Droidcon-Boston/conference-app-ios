//
//  AgendaHeader.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 4/1/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit

class AgendaHeader: UITableViewCell {
    
    @IBOutlet weak var topDivider: UIView!
    @IBOutlet weak var bottomDivider: UIView!
    @IBOutlet weak var timeLabel: UILabel!
    
    
    override func awakeFromNib() {
        self.backgroundColor = UIColor.themeGreyLight
        self.timeLabel.textColor = UIColor.themeBlueMain
        self.topDivider.backgroundColor = UIColor.themeGreenAccent
        self.bottomDivider.backgroundColor = UIColor.themeGreenAccent
    }
    
}
