//
//  FAQController
//  DroidconBoston
//
//  Created by Justin Poliachik on 3/16/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import UIKit

class FAQController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var tableView: UITableView!
    
    var items: [FAQItem] = []
    var rows: [[FAQItem]] = []
    var sections: [String] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 100
        tableView.sectionHeaderHeight = UITableViewAutomaticDimension;
        tableView.estimatedSectionHeaderHeight = 50;
        
        getData()
        
        FAQAPI.downloadFAQ { (success) in
            self.getData()
        }
    }
    
    func getData() {
        
        FAQAPI.getFAQ { (results) in
            
            if let results = results {
                
                let tableData = FAQAPI.createTableData(items: results)
                self.rows = tableData.rows
                self.sections = tableData.sections
                
                self.items = results;
                self.tableView.reloadData()
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
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return self.sections.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.rows[section].count
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return self.sections[section]
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        
        let header = tableView.dequeueReusableCell(withIdentifier: "FAQHeader") as! FAQHeader
        header.questionText.text = self.sections[section]
        return header
    }
    
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "FAQCell") as! FAQCell
        
        let item = self.rows[indexPath.section][indexPath.row]
        
        cell.answerText.text = item.answer
        
        if (item.otherUrl != nil) {
            cell.accessoryType = .disclosureIndicator
            cell.selectionStyle = .default
        } else {
            cell.accessoryType = .none
            cell.selectionStyle = .none
        }

        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let item = self.rows[indexPath.section][indexPath.row]
        if let link = item.otherUrl, let url = URL(string: link) {
            if #available(iOS 10.0, *) {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
            } else {
                UIApplication.shared.openURL(url)
            }

        }
    }

    
}

