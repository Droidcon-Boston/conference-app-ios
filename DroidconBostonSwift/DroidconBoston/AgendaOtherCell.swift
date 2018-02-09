//
//  AgendaOtherCell.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 4/5/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit

class AgendaOtherCell: UITableViewCell {
    
    @IBOutlet weak var name: UILabel!
    
    override func awakeFromNib() {
        self.name?.textColor = UIColor.themeBlueMain
    }
    
}
