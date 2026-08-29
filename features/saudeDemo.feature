Feature: verify sauceDemo website

  Scenario: verify user can login
    Given I navigate to the website
    When I login with default credentials
    Then I add the item "Sauce Labs Backpack" to cart
    And I complete express checkout
