//
//  AgendaPagerController.swift
//  DroidconBoston
//
//  Created by Justin Poliachik on 4/1/17.
//  Copyright © 2017 Droidcon Boston. All rights reserved.
//

import XLPagerTabStrip

class AgendaPagerController: ButtonBarPagerTabStripViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        buttonBarView.selectedBar.backgroundColor = UIColor.themeBlueMain
        buttonBarView.backgroundColor = UIColor.white
        settings.style.buttonBarBackgroundColor = UIColor.white
        settings.style.buttonBarItemTitleColor = UIColor.themeBlueMain
        settings.style.buttonBarItemBackgroundColor = UIColor.white
        settings.style.buttonBarItemFont = UIFont.systemFont(ofSize: 14, weight: UIFontWeightBold)

    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override public func viewControllers(for pagerTabStripController: PagerTabStripViewController) -> [UIViewController] {
        
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        
        let agendaControllerFirst = storyboard.instantiateViewController(withIdentifier: "AgendaController") as! AgendaController
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "M/d/yyyy"
        agendaControllerFirst.date = dateFormatter.date(from: "4/10/2017")!
        
        let agendaControllerSecond = storyboard.instantiateViewController(withIdentifier: "AgendaController") as! AgendaController
        agendaControllerSecond.date = dateFormatter.date(from: "4/11/2017")!

        
        return [agendaControllerFirst, agendaControllerSecond]
    }
}

