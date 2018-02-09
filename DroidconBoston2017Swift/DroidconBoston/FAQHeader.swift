//
//  FAQHeader.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 4/3/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit

class FAQHeader: UITableViewCell {
    
    @IBOutlet weak var topDivider: UIView!
    @IBOutlet weak var bottomDivider: UIView!
    @IBOutlet weak var questionText: UILabel!
    
    override func awakeFromNib() {
        self.backgroundColor = UIColor.themeGreyLight
        self.topDivider.backgroundColor = UIColor.themeGreenAccent
        self.bottomDivider.backgroundColor = UIColor.themeGreenAccent
        self.questionText.textColor = UIColor.themeBlueMain
    }
    
}
