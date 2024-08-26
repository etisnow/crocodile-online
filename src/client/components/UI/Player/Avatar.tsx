import avatar1 from '../../../assets/avatars/1.svg'
import avatar10 from '../../../assets/avatars/10.svg'
import avatar11 from '../../../assets/avatars/11.svg'
import avatar12 from '../../../assets/avatars/12.svg'
import avatar13 from '../../../assets/avatars/13.svg'
import avatar14 from '../../../assets/avatars/14.svg'
import avatar15 from '../../../assets/avatars/15.svg'
import avatar16 from '../../../assets/avatars/16.svg'
import avatar2 from '../../../assets/avatars/2.svg'
import avatar3 from '../../../assets/avatars/3.svg'
import avatar4 from '../../../assets/avatars/4.svg'
import avatar5 from '../../../assets/avatars/5.svg'
import avatar6 from '../../../assets/avatars/6.svg'
import avatar7 from '../../../assets/avatars/7.svg'
import avatar8 from '../../../assets/avatars/8.svg'
import avatar9 from '../../../assets/avatars/9.svg'

const avatars = [
  avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9,
  avatar10, avatar11, avatar12, avatar13, avatar14, avatar15, avatar16
]

interface IAvatar {
  avatarNumber?: number
}

const Avatar: React.FC<IAvatar> = ({ avatarNumber = 0 }) => {
  return (
    <img src={avatars[avatarNumber]}></img>
  )
}

export default Avatar
