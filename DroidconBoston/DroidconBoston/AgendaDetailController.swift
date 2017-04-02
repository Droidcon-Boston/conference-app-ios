//
//  AgendaDetailController.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 4/1/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit

class AgendaDetailController: UIViewController  {
    
    var agendaEvent: Event?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        print("agenda")
        print(self.agendaEvent)
    }

}
