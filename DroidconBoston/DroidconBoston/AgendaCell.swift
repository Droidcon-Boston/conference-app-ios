//
//  AgendaCell.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 4/1/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit

class AgendaCell: UITableViewCell {
    
    @IBOutlet weak var userImage: UIImageView!
    @IBOutlet weak var name: UILabel!
    @IBOutlet weak var talkTitle: UILabel!
    
    override func awakeFromNib() {
        self.name?.textColor = UIColor.themeBlueMain
        self.talkTitle?.textColor = UIColor.themeBlueMain
        self.userImage.layer.cornerRadius = 28
        self.selectionStyle = .none
    }
    
}
