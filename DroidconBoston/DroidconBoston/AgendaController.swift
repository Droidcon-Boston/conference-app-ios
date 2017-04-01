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
    var rows: [[Event]] = []
    var sections: [Date] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.dataSource = self
        tableView.delegate = self
        
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 100
        tableView.separatorColor = UIColor.themeGreenAccent
        
        AgendaAPI.getAgendaLocal { (events) in
            
            if let events = events {
                
                let dateFormatter = DateFormatter()
                dateFormatter.dateFormat = "M/d/yyyy"
                let tableDate = dateFormatter.date(from: "4/11/2017")!
                
                let tableData = AgendaAPI.createTableData(events: events, day: tableDate)
                self.rows = tableData.rows
                self.sections = tableData.sections

                self.events = events;
                self.tableView.reloadData()
            } else {
                // handle error
                print("error getting agenda")
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return self.sections.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.rows[section].count
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        let timeFormatter = DateFormatter()
        timeFormatter.dateFormat = "h:mm a"
        let date = self.sections[section]
        return timeFormatter.string(from: date)
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "AgendaCell", for: indexPath) as! AgendaCell
        
        // clear out image first, to prevent a recycling flash
        cell.userImage.image = nil
        
        let eventObject = self.rows[indexPath.section][indexPath.row]
        
        cell.name.text = eventObject.name
        cell.talkTitle.text = eventObject.talk
        
        if let imageUrl = URL(string: eventObject.photoUrl) {
            cell.userImage?.af_setImage(withURL: imageUrl)
        } else {
            cell.userImage.image = nil
        }
        
        
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print("selected row \(indexPath.row)")
    }
    
}

