//
//  AgendaController.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 3/16/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit
import AlamofireImage
import XLPagerTabStrip

class AgendaController: UIViewController, UITableViewDataSource, UITableViewDelegate, IndicatorInfoProvider {
    
    @IBOutlet weak var tableView: UITableView!
    
    var events: [Event] = []
    var rows: [[Event]] = []
    var sections: [Date] = []
    
    var activeSection: Int?
    
    var date: Date?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.navigationItem.backBarButtonItem?.title = " "
        
        tableView.dataSource = self
        tableView.delegate = self
        
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 100
        tableView.sectionHeaderHeight = 40
        tableView.separatorColor = UIColor.themeGreenAccent
        
        getData()
        
        AgendaAPI.downloadAgenda { (success) in
            self.getData()
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        // scroll to the current time if applicable
        let currentDate = Date()
        
        var activeSection: Int?
        
        for (i, element) in self.sections.enumerated() {
            let firstDate = element
            var nextDate: Date
            if (i == self.sections.count - 1) {
                // last item
                nextDate = firstDate.addingTimeInterval(1.0 * 60.0 * 60.0) // add hour to last date
            } else {
                nextDate = self.sections[i + 1]
            }
            
            if (currentDate >= firstDate && currentDate < nextDate) {
                // this section is currently happening
                activeSection = i
            }
        }
        
        if let activeSection = activeSection {
            self.activeSection = activeSection
        }
    }
    
    func getData() {
        
        AgendaAPI.getAgenda { (events) in
            
            if let events = events {
                
                let tableData = AgendaAPI.createTableData(events: events, day: self.date!)
                self.rows = tableData.rows
                self.sections = tableData.sections
                
                self.events = events;
                self.tableView.reloadData()
            } else {
                
                // something went WRONG. 
                // since we should be loading either Bundle .json, or cached .json from documents directory
                // an error here means the schema probably changed at some point.
                let alert = UIAlertController(title: "Error", message: "An error occurred processing Agenda data.", preferredStyle: UIAlertControllerStyle.alert)
                alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: nil))
                self.present(alert, animated: true, completion: nil)
                
            }
        }
    }
    
    func indicatorInfo(for pagerTabStripController: PagerTabStripViewController) -> IndicatorInfo {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MMMM d"
        let dateString = dateFormatter.string(from: self.date!)

        return IndicatorInfo(title: dateString.uppercased())
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
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let timeFormatter = DateFormatter()
        timeFormatter.dateFormat = "h:mm a"
        let date = self.sections[section]
        let dateString = timeFormatter.string(from: date)
        
        let header = tableView.dequeueReusableCell(withIdentifier: "AgendaHeader") as! AgendaHeader
        
        header.timeLabel.text = dateString
        
        if let activeSection = self.activeSection, activeSection == section {
            header.backgroundColor = UIColor.themeGreenAccent
        }
        
        return header
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        var returnCell: UITableViewCell
        
        let eventObject = self.rows[indexPath.section][indexPath.row]
        
        if (eventObject.name == "NOTATALK") {
            // not talk cell
            let cell = tableView.dequeueReusableCell(withIdentifier: "AgendaOtherCell", for: indexPath) as! AgendaOtherCell
            cell.name.text = eventObject.talk
            returnCell = cell
            
            if let description = eventObject.description, (URL(string: description) != nil) {
                // there's a clickable link in description
                cell.accessoryType = .disclosureIndicator
                cell.selectionStyle = .default
            } else {
                cell.accessoryType = .none
                cell.selectionStyle = .none
            }
        } else {
            // normal talk cell
            let cell = tableView.dequeueReusableCell(withIdentifier: "AgendaCell", for: indexPath) as! AgendaCell
            
            // clear out image first, to prevent a recycling flash
            cell.userImage.image = nil
            
            cell.name.text = eventObject.name
            cell.talkTitle.text = eventObject.talk
            cell.location.text = eventObject.room
            
            if let photoUrl = eventObject.photoUrl, let imageUrl = URL(string: photoUrl) {
                cell.userImage?.af_setImage(withURL: imageUrl)
            } else {
                cell.userImage.image = nil
            }
            returnCell = cell
        }
        
        return returnCell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let eventObject = self.rows[indexPath.section][indexPath.row]
        
        if (eventObject.name == "NOTATALK") {
            
            // see if there's a url to use in description or not
            if let description = eventObject.description, let url = URL(string: description) {
                if #available(iOS 10.0, *) {
                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
                } else {
                    UIApplication.shared.openURL(url)
                }
            }
            
        } else {
            let detailController = self.storyboard!.instantiateViewController(withIdentifier: "AgendaDetailController") as! AgendaDetailController
            detailController.agendaEvent = eventObject
            
            self.navigationController!.pushViewController(detailController, animated: true)
        }
    }
}

