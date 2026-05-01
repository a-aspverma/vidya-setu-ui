import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const initial = user?.name?.charAt(0).toUpperCase();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 py-6">
        <h1 className="text-2xl font-serif font-normal dark:text-gray-100">My Profile</h1>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-br from-teal-500 to-teal-800 relative">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          {/* Avatar */}
          <div className="px-6 -mt-9 relative z-10">
            <div className="h-16 w-16 rounded-full bg-teal-600 border-4 border-white dark:border-gray-800 flex items-center justify-center text-white text-2xl font-medium">
              {initial}
            </div>
          </div>

          {/* Identity */}
          <div className="px-6 pt-3 pb-4">
            <h2 className="text-xl font-semibold dark:text-gray-100">{user?.name}</h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-teal-50 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full mt-1 capitalize">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              {user?.role}
            </span>
          </div>

          <hr className="mx-6 border-gray-100 dark:border-gray-700" />

          {/* Fields */}
          <div className="grid grid-cols-2 gap-3 p-6">
            <div className="col-span-2 bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Email</p>
              <p className="text-sm dark:text-gray-100">{user?.email}</p>
            </div>
            {user?.grade && (
              <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Grade</p>
                <p className="text-sm dark:text-gray-100">Grade {user.grade}</p>
              </div>
            )}
            {user?.location && (
              <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Location</p>
                <p className="text-sm dark:text-gray-100">{user.location}</p>
              </div>
            )}
            {user?.school && (
              <div className="col-span-2 bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">School</p>
                <p className="text-sm dark:text-gray-100">{user.school}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;