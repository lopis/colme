Feature: Todo

    In order to use colme
    As a user
    I want to be able to drag columns, toggle their visibility and resize them

    @javascript
    Scenario: Drag one column
        Given I am on the home page
        When  I drag the column 2011 500px to right
        Then  I should see the column 2012 before the column 2011

    @javascript
    Scenario: Drag one column back and forth
        Given I am on the home page
        When  I drag the column 2011 500px to right
        And   I drag the column 2011 500px to left
        Then  I should see the column 2011 before the column 2012

    @javascript
    Scenario: Hide one column
        Given I am on the home page
        When  I click the button Sales Report
        Then  The cell Sales Report should not be visible
        And   The cell sales should not be visible
        And   The cell Info should not be visible
        And   The cell id should not be visible
        And   The cell 2011 should not be visible
        And   The cell 2012 should not be visible
        And   The cell a should not be visible
        And   The cell 1º Sem should not be visible
        And   The cell 2º Sem should not be visible
        And   The cell 3º Tri should not be visible
        And   The cell 4º Tri should not be visible

    @javascript
    Scenario: Scroll Down
        Given I am on the home page
        When  I scroll down 
        Then  The header must be down 
