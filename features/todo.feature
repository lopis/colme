Feature: Todo

    In order to use colme
    As a user
    I want to be able to drag columns, toggle their visibility and resize them

    @javascript
    @pause
    Scenario: Drag one column
        Given I am on the home page
        And I see the column 2012 and the column 2011
        When I drag the column 2011 to the column 2012
        And I release the mouse button
        Then I should see the column 2012 before the column 2011
