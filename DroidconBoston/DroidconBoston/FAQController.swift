//
//  FAQController
//  DroidconBoston
//
//  Created by Justin Poliachik on 3/16/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit

class FAQController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        getData()
        
        FAQAPI.downloadFAQ { (success) in
            self.getData()
        }
    }
    
    func getData() {
        
        FAQAPI.getFAQ { (results) in
            
            if let results = results {
                
                //let tableData = AgendaAPI.createTableData(events: events, day: self.date!)
                //self.rows = tableData.rows
                //self.sections = tableData.sections
                
                //self.events = events;
                //self.tableView.reloadData()
            } else {
                
                // something went WRONG.
                // since we should be loading either Bundle .json, or cached .json from documents directory
                // an error here means the schema probably changed at some point.
                let alert = UIAlertController(title: "Error", message: "An error occurred processing FAQ data.", preferredStyle: UIAlertControllerStyle.alert)
                alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: nil))
                self.present(alert, animated: true, completion: nil)
                
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
}

