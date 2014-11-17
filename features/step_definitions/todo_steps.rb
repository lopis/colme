Given(/^I am on the home page$/) do
  visit "demo/smallTableDemo.html"
end

When(/^I see the column (.*) and the column (.*)$/) do |name1, name2|
  find('#cm-table1 .cm-th', :text => name1)
  find('#cm-table1 .cm-th', :text => name2)
end

When(/^I drag the column (.*) to the column (.*)$/) do |name1, name2|
  find('#cm-table1 .cm-th', :text => name1).drag_to(find('#cm-table1 .cm-th', :text => name2))
end

When(/^I release the mouse button$/) do
  pending # express the regexp above with the code you wish you had
end

Then(/^I should see the column (.*) before the column (.*)$/) do |arg1, arg2|
  pending # express the regexp above with the code you wish you had
end

AfterStep('@pause') do
  print "Press Return to continue..."
  STDIN.getc
end