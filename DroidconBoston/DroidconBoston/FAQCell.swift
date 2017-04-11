//
//  FAQCell.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 4/3/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit

class FAQCell: UITableViewCell {

    @IBOutlet weak var answerText: UILabel!
    
    override func awakeFromNib() {
        self.answerText.textColor = UIColor.themeBlueDark
    }
}
