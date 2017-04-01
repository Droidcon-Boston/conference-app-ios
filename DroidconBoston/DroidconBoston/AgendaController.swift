//
//  AgendaController.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 3/16/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit
import AlamofireImage

class AgendaController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    @IBOutlet weak var tableView: UITableView!
    
    var events: [Event] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.dataSource = self
        tableView.delegate = self
        
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 100
        tableView.separatorColor = UIColor.themeGreenAccent
        
        AgendaAPI.getAgendaLocal { (events) in
            
            if let events = events {
                self.events = events;
                self.tableView.reloadData()
            } else {
                // handle error
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return events.count
    }
    
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "AgendaCell", for: indexPath) as! AgendaCell
        
        // clear out image first, to prevent a recycling flash
        cell.userImage.image = nil
        
        let eventObject = events[indexPath.row]
        
        cell.name.text = eventObject.name
        cell.talkTitle.text = eventObject.talk
        
        if let imageUrl = URL(string: eventObject.photoUrl) {
            cell.userImage?.af_setImage(withURL: imageUrl)
        } else {
            cell.userImage.image = nil
        }
        
        
        return cell
    }

    
    
}

