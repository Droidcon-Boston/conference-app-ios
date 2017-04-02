//
//  AgendaDetailController.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 4/1/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit
import AlamofireImage

class AgendaDetailController: UIViewController  {
    
    var agendaEvent: Event?
    
    @IBOutlet weak var talkTitle: UILabel!
    @IBOutlet weak var time: UILabel!
    @IBOutlet weak var location: UILabel!
    @IBOutlet weak var talkDescription: UILabel!
    @IBOutlet weak var userImage: UIImageView!
    @IBOutlet weak var presenterName: UILabel!
    @IBOutlet weak var socialContainer: UIView!
    @IBOutlet weak var presenterBio: UILabel!
    @IBOutlet weak var dividerTop: UIView!
    @IBOutlet weak var dividerMiddle: UIView!
    
    @IBOutlet weak var socialContainerConstraintWidth: NSLayoutConstraint!
    @IBOutlet weak var socialButtonTwitter: UIButton!
    @IBOutlet weak var socialButtonTwitterWidth: NSLayoutConstraint!
    @IBOutlet weak var socialButtonFacebook: UIButton!
    @IBOutlet weak var socialButtonFacebookWidth: NSLayoutConstraint!
    @IBOutlet weak var socialButtonLinked: UIButton!
    @IBOutlet weak var socialButtonLinkedWidth: NSLayoutConstraint!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.navigationItem.title = "Details"
        self.navigationItem.backBarButtonItem?.title = " "
        
        self.userImage.layer.cornerRadius = self.userImage.frame.size.width / 2.0
        self.userImage.clipsToBounds = true
        
        self.dividerTop.backgroundColor = UIColor.themeGreenAccent
        self.dividerMiddle.backgroundColor = UIColor.themeGreenAccent
        
        if let agendaEvent = self.agendaEvent {
            talkTitle.text = agendaEvent.talk
            
            if let date = agendaEvent.date {
                let timeFormatter = DateFormatter()
                timeFormatter.dateFormat = "h:mm a"
                time.text = timeFormatter.string(from: date)
            }
            
            location.text = agendaEvent.room
            talkDescription.text = agendaEvent.description
            
            if let imageUrl = URL(string: agendaEvent.photoUrl) {
                userImage.af_setImage(withURL: imageUrl)
            }
            
            presenterName.text = agendaEvent.name
            presenterBio.text = agendaEvent.bio
            
            let buttonWidth = CGFloat(50.0)
            var socialWidth = CGFloat(0.0)
            if (agendaEvent.twitter != nil) {
                socialWidth = socialWidth + buttonWidth
                socialButtonTwitterWidth.constant = buttonWidth
            }
            if (agendaEvent.facebook != nil) {
                socialWidth = socialWidth + buttonWidth
                socialButtonFacebookWidth.constant = buttonWidth
            }
            if (agendaEvent.linkedIn != nil) {
                socialWidth = socialWidth + buttonWidth
                socialButtonLinkedWidth.constant = buttonWidth
            }
            
            socialContainerConstraintWidth.constant = socialWidth
        }
    }

}
