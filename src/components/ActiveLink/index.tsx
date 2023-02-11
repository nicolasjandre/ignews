import Link, { LinkProps } from "next/link"
import { useRouter } from "next/router";

interface ActiveLinkProps extends LinkProps {
  activeClassName: string,
  children: string;
}

export function ActiveLink({ activeClassName, ...rest }: ActiveLinkProps) {
  let { asPath } = useRouter()
  
  if (asPath.includes('posts')) asPath = '/posts'
  
  return (
    <Link className={asPath === rest.href ? activeClassName : ''} {...rest} />
  )
}