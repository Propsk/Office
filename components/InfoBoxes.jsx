import React from 'react'
import InfoBox from './InfoBox'

const InfoBoxes = () => {
  return (
    <section>
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <InfoBox
            heading = 'Rent Office Space'
            backgroundColor = 'bg-gray-100'
            buttonInfo={{
                text: 'Browse Offices',
                link: '/properties',
                backgroundColor: 'bg-black'
            }}>
                Have a proper business address. View offices and hotdesks.
            </InfoBox>

            <InfoBox
            heading = 'Landlords'
            backgroundColor = 'bg-blue-100'
            buttonInfo={{
                text: 'Add Properites',
                link: '/properties/add',
                backgroundColor: 'bg-blue-500'
            }}>
                We rent office space daily, weekly or monthly. Rent as a hotdesk or long term.
            </InfoBox>
        </div>
      </div>
    </section>
  )
}

export default InfoBoxes
