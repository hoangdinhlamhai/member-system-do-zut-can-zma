import React from 'react';
import { Box, Text, Avatar } from 'zmp-ui';
import { useMember } from '../hooks/use-member';

const Header: React.FC = () => {
  const { member } = useMember();

  return (
    <Box className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <Box
        className="flex items-center justify-between px-5 pb-3"
        style={{ paddingTop: 'calc(var(--safe-top) + 14px)' }}
      >
        <Box className="flex items-center gap-2.5">
          {/* Brand mark */}
          <Box
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Text className="text-white font-display font-bold text-sm">Z</Text>
          </Box>
          <Text className="font-display font-bold text-lg text-text-main dark:text-dark-text tracking-tight">
            Zô Dứt Cạn
          </Text>
        </Box>
        <Box className="flex items-center gap-2">
          {member && (
            <Avatar
              src={member.zaloAvatar || 'https://i.pravatar.cc/150'}
              size={34}
              className="border-2 border-primary/30 rounded-full object-cover ring-2 ring-primary/10 ring-offset-1"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
