<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ColmeTests
 *
 * @author abraham
 */
class ColmeTests extends PHPUnit_Framework_TestCase
{
    
    /**
     * @var \RemoteWebDriver
     */
    protected $webDriver;
    
    protected $url = 'http://colme/demo/smallTableDemo.html';
    
    public function setUp()
    {
        $capabilities = array(\WebDriverCapabilityType::BROWSER_NAME => 'firefox');
        $this->webDriver = RemoteWebDriver::create('http://localhost:4444/wd/hub', $capabilities);
    }
    
    protected function tearDown()
    {
        if ($this->hasFailed())
        {
            $date = "screenshot_" . date('Y-m-d-H-i-s') . ".png" ;
            $this->webdriver->getScreenshotAndSaveToFile( $date );
        }
        $this->webDriver->close();
    }
    
    public function testColmeHome()
    {
        $this->webDriver->get($this->url);
        // checking that page title contains word 'GitHub'
        $this->assertContains('Colme', $this->webDriver->getTitle());
    }
    
    public function testDragAndDrop()
    {
        $this->webDriver->get($this->url);
        $ancestorElementA = $this->webDriver->findElement(WebDriverBy::cssSelector('#cm-table1 > div.cm-thead > div:nth-child(2)')
        )->findElements(WebDriverBy::cssSelector('.cm-th'));
        $posA=-1;
        $posB=-1;
        $elementA=null;
        $elementB=null;
        for($i=0;$i<sizeof($ancestorElementA);$i++)
        {
           if(strcmp($ancestorElementA[$i]->getAttribute('data-cm-id'), "cm-1-0-0")==0)
           {
               $posA=$i;
               $elementA=$ancestorElementA[$i];   
           }
           if(strcmp($ancestorElementA[$i]->getAttribute('data-cm-id'), "cm-1-1-0")==0)
           {
               $posB=$i;
               $elementB=$ancestorElementA[$i];
           } 
        }
        $this->webDriver->getMouse()->mouseMove($elementA->getCoordinates());
        $this->webDriver->getMouse()->mouseDown();
        $this->webDriver->getMouse()->mouseMove($elementB->getCoordinates());
        $this->webDriver->getMouse()->mouseUp();
        $ancestorElementB = $this->webDriver->findElement(WebDriverBy::cssSelector('#cm-table1 > div.cm-thead > div:nth-child(2)')
        )->findElements(WebDriverBy::cssSelector('.cm-th'));
        $posA2=-1;
        $posB2=-1;
        for($i=0;$i<sizeof($ancestorElementB);$i++)
        {
           if(strcmp($ancestorElementB[$i]->getAttribute('data-cm-id'), "cm-1-0-0")==0)
           {
               $posA2=$i;
           }
           if(strcmp($ancestorElementB[$i]->getAttribute('data-cm-id'), "cm-1-1-0")==0)
           {
               $posB2=$i;   
           }
        }
        $this->assertEquals($posA, $posB2);     
        $this->assertEquals($posB, $posA2);
        
    }

}