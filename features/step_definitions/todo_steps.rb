module CapybaraExtension
  def drag_by(right_by, down_by)
    base.drag_by(right_by, down_by)
  end
end

module CapybaraSeleniumExtension
  def drag_by(right_by, down_by)
    driver.browser.action.drag_and_drop_by(native, right_by, down_by).perform
  end
end

::Capybara::Selenium::Node.send :include, CapybaraSeleniumExtension
::Capybara::Node::Element.send :include, CapybaraExtension

Given(/^I am on the home page$/) do
  visit "demo/smallTableDemo.html"
end

When(/^I drag the column (.*) to the column (.*)$/) do |name1, name2|
  find('#cm-table1 .cm-th', :text => name1).drag_to(find('#cm-table1 .cm-th', :text => name2))
end

When(/^I drag the column (.*) (\d+)px to (.*)$/) do |name, pixels, direction|
  if direction == 'left'
    find('#cm-table1 .cm-th', :text => name).drag_by(0-pixels.to_i,0)
  elsif direction == 'right'
    find('#cm-table1 .cm-th', :text => name).drag_by(pixels,0)
  elsif direction == 'up'
    find('#cm-table1 .cm-th', :text => name).drag_by(0,pixels)
  elsif direction == 'down'
    find('#cm-table1 .cm-th', :text => name).drag_by(0,0-pixels.to_i)
  end
end

Then(/^I should see the column (.*) before the column (.*)$/) do |name1, name2|
  find('#cm-table1 > div:nth-child(1) > div:nth-child(3) > div:nth-child(2)', :text => name1)
  find('#cm-table1 > div:nth-child(1) > div:nth-child(3) > div:nth-child(3)', :text => name2)
end

When(/^I click the button (.*)$/) do |name|
  first(:css, 'button', :text=> name).click()
end

Then(/^The cell (.*) should not be visible$/) do |name|
  all('#cm-table1 .cm-th', :text => /^#{Regexp.escape(name)}$/, :exact => true, :visible => false)
  all('#cm-table2 .cm-th', :text => /^#{Regexp.escape(name)}$/, :exact => true, :visible => true)
end

AfterStep('@pause') do
  print "Press Return to continue..."
  STDIN.getc
end

When(/^I scroll down$/) do
  print page.execute_script "window.scrollBy(0,500)"
end

Then(/^The header must be down $/) do
  print find("#cm-table1 .cm-thead")["style"]
  if  ! /transform: translateY\(3..px\)/.match(find("#cm-table1 .cm-thead")["style"])
    fail("ArgumentError")
  end
end
