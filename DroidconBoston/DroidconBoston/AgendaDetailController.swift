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
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.navigationItem.title = self.agendaEvent?.talk
        self.navigationItem.backBarButtonItem?.title = " "
        
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
            
            // todo social container
            presenterBio.text = agendaEvent.bio
            
        }
    }

}
