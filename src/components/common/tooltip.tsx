type TooltipProps = React.HTMLAttributes<HTMLElement>

export const CustomTooltip = (props: TooltipProps): JSX.Element => {
  return (
    <span style={props.style} className={props.className}>
      {props.title}
    </span>
  )
}
