import {
  HighlightHeadings,
  HighlightListItems,
  HighlightImageAltText,
  HighlightLineBreaks,
  HighlightLiveRegionFinder,
  HighlightTabIndex,
  HighlightFocusIndicator,
  HighlightWhatFocused,
  HighlightTextSpacing,
  HighlightAriaRoles,
  HighlightAutocomplete,
  HighlightLandMarks,
  HighlightTable,
  HighlightBtnLinks,
  HighlightTargetSize
} from './components'

function App() {
  return (
    <>
      <div className="toolkit">
        <div className="toolkit__container">
          <HighlightHeadings />
          <HighlightListItems />
          <HighlightTable />
          <HighlightImageAltText />
          <HighlightTextSpacing />
          <HighlightTabIndex />
          <HighlightBtnLinks />
          <HighlightAriaRoles />
          <HighlightAutocomplete />
          <HighlightLandMarks />
          <HighlightFocusIndicator />
          <HighlightWhatFocused />
          <HighlightLineBreaks />
          <HighlightLiveRegionFinder />
          <HighlightTargetSize />
        </div>
      </div>
    </>
  )
}

export default App
