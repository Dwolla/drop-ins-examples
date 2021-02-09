# Dwolla Drop-in Examples
This repo contains Dwolla Drop-in Components using Express. Examples include forms to Create an [Unverified Customer](https://developers.dwolla.com/concepts/customer-types#unverified-customer), Upgrade an Unverified Customer to a [Verified Customer](https://developers.dwolla.com/concepts/customer-types#verified-customer), Create a [Personal Verified Customer](https://developers.dwolla.com/concepts/customer-types#personal-verified-customer), Upload Documents, and View a Verified Customer's Balance. 

Additional drop-in components will be added to this repo as new ones are released.

Drop-in components are tools designed to assist with a Dwolla integration. As with any tool, it may not fit all desired use cases.

## Installation 

`yarn install`
`yarn start`

## How to use it

Copy + Paste code related to the component you'd like to use in order to expediate your Dwolla API integration process, and save weeks of development work.

You can also read our [Drop-in Components blog series](https://www.dwolla.com/updates/low-code-drop-in-components/) for a step by step guide on how to get started using the first five low-code components.

## Drop-ins UI

By default, the elements within your specified container are responsive to any change and screen size. Dwolla also allows you to customize the styling of your components by providing a stylesheet dwolla.configure containing the attributes found here.

### Create a Customer

This drop-in component form creates both a [Receive Only Customer](https://developers.dwolla.com/concepts/customer-types#unverified-customer) (with `type = "receive-only"`) and an [Unverified Customer](https://developers.dwolla.com/concepts/customer-types#unverified-customer)

![create_a_customer](/images/create_a_customer.png)

### Upgrade a Customer

This drop-in component form upgrades an Unverified Customer to a [Verified Customer](https://developers.dwolla.com/concepts/customer-types#verified-customer)

![upgrade_a_customer](/images/upgrade_customer.png)

### Personal VCR

This drop-in component form creates a [Verified Customer](https://developers.dwolla.com/concepts/customer-types#verified-customer)

![personal_vcr](/images/create_pvc.png)

### Upload Documents

This drop-in component let's a Personal Verified Customer to upload their government issued document

![upload_document](/images/upload_document.png)


### Balance Display

This drop-in component let's a Personal Verified Customer view their balance.

![balance_display](/images/balance_display.png)


### Pay-In

This drop-in component can be used in order to transfer from a Customer funding source into your own funding source

![pay_in](/images/pay_in.png)


## Where to find the docs

Visit our Guide or API docs for more additional information. 

## Support

Support queries can be directed to our [Developer Forum](https://discuss.dwolla.com/).

## Contributing and Reporting Bugs

Feel free to fork this repo and submit PRs for any corrections, new features, etc. you think we should include!
